import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural, { useOmniAural, useOmniAuralEffect } from 'omniaural'
import type { Episode } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import {
  EpisodeListItem,
  Footer,
  List,
  MessageWithAction,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  scrollToTopOfPageScrollableContent,
  SearchBarFilter,
  Tiles
} from '~/components'
import { Page } from '~/lib/utility/page'
import { determinePageCount } from '~/lib/utility/pagination'
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug, getTranslatedCategories } from '~/services/category'
import { getEpisodesByQuery } from '~/services/episode'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverCookies: any
  serverEpisodesListData: Episode[]
  serverEpisodesListDataCount: number
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
}

const keyPrefix = 'pages_episodes'

export default function Episodes({
  serverCategoryId,
  serverCookies,
  serverEpisodesListData,
  serverEpisodesListDataCount,
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverGlobalFilters
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [cookies, setCookie] = useCookies([])

  const [filterQuery, setFilterQuery] = useState<any>({
    filterCategoryId: serverCategoryId || null,
    filterFrom: serverFilterFrom,
    filterPage: serverFilterPage,
    filterSearchText: '',
    filterSort: serverFilterSort,
    videoOnlyMode: serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  })
  const { filterCategoryId, filterFrom, filterPage, filterSearchText, filterSort, videoOnlyMode } = filterQuery
  const [tempFilterQuery, setTempFilterQuery] = useState<any>({
    tempFilterEnabled: false,
    tempFilterFrom: serverFilterFrom,
    tempFilterSort: serverFilterSort
  })
  const { tempFilterEnabled, tempFilterFrom, tempFilterSort } = tempFilterQuery

  const [episodesListData, setEpisodesListData] = useState<Episode[]>(serverEpisodesListData)
  const [episodesListDataCount, setEpisodesListDataCount] = useState<number>(serverEpisodesListDataCount)
  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const initialRender = useRef(true)
  const pageCount = determinePageCount(filterPage, episodesListData, episodesListDataCount, !!filterSearchText)
  const isCategoryPage = !!router.query?.category
  const isCategoriesPage = filterFrom === PV.Filters.from._category && !isCategoryPage
  const isLoggedInSubscribedPage = userInfo && filterFrom === PV.Filters.from._subscribed
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Episodes')} > ${selectedCategory.title}` : t('Episodes')
  const showLoginMessage = !userInfo && filterFrom === PV.Filters.from._subscribed

  const categories = getTranslatedCategories(t)

  /* useEffects */

  useOmniAuralEffect(() => {
    const newStateVal = OmniAural.state.globalFilters.videoOnlyMode.value()
    setFilterQuery({
      ...filterQuery,
      videoOnlyMode: newStateVal
    })
    const globalFilters = cookies.globalFilters || {}
    setCookie(
      'globalFilters',
      {
        ...globalFilters,
        videoOnlyMode: newStateVal
      },
      { path: PV.Cookies.path }
    )
  }, 'globalFilters.videoOnlyMode')

  useEffect(() => {
    window.addEventListener('navbar-link-clicked-episodes', _handleSearchClear)
    return () => window.removeEventListener('navbar-link-clicked-episodes', _handleSearchClear)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (initialRender.current) {
          initialRender.current = false
        } else {
          OmniAural.pageIsLoadingShow()
          setIsQuerying(true)

          const { data } = await clientQueryEpisodes()
          const [newListData, newListCount] = data
          setEpisodesListData(newListData)
          setEpisodesListDataCount(newListCount)
        }
      } catch (err) {
        console.log(err)
      }
      OmniAural.pageIsLoadingHide()
      setIsQuerying(false)
      scrollToTopOfPageScrollableContent()
    })()
  }, [filterQuery])

  /* Client-Side Queries */

  const clientQueryEpisodes = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryEpisodesAll()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryEpisodesByCategory()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryEpisodesBySubscribed()
    }
  }

  const clientQueryEpisodesAll = async () => {
    const finalQuery = {
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getEpisodesByQuery(finalQuery)
  }

  const clientQueryEpisodesByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getEpisodesByQuery(finalQuery)
  }

  const clientQueryEpisodesBySubscribed = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery = {
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getEpisodesByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.episodes}`)
    const selectedItem = selectedItems[0]
    let newPage = filterPage
    let newSort = filterSort
    if (selectedItem.key !== filterFrom) newPage = 1

    if (selectedItem.key !== PV.Filters.from._subscribed && isNotAllSortOption(filterSort)) {
      newSort = PV.Filters.sort._topPastWeek
    }

    setFilterQuery({
      ...filterQuery,
      filterCategoryId: null,
      filterFrom: selectedItem.key,
      filterPage: newPage,
      filterSort: newSort
    })
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    let newPage = filterPage
    if (selectedItem.key !== filterSort) newPage = 1
    setFilterQuery({
      ...filterQuery,
      filterSort: selectedItem.key,
      filterPage: newPage
    })
  }

  const _handleSearchSubmit = async (val: string) => {
    if (!tempFilterEnabled && val) {
      setTempFilterQuery({
        tempFilterEnabled: true,
        tempFilterFrom: filterFrom,
        tempFilterSort: filterSort
      })
      setFilterQuery({
        ...filterQuery,
        filterCategoryId: null,
        filterFrom: PV.Filters.from._all,
        filterPage: 1,
        filterSearchText: val,
        filterSort: PV.Filters.sort._topPastWeek
      })
    } else if (tempFilterEnabled && !val) {
      setTempFilterQuery({
        ...tempFilterQuery,
        tempFilterEnabled: false
      })
      setFilterQuery({
        ...filterQuery,
        filterFrom: tempFilterFrom,
        filterPage: 1,
        filterSearchText: val,
        filterSort: tempFilterSort
      })
    } else {
      setFilterQuery({
        ...filterQuery,
        filterCategoryId,
        filterPage: 1,
        filterSearchText: val
      })
    }
  }

  const _handleSearchClear = () => {
    _handleSearchSubmit('')
  }

  /* Render Helpers */

  const generateEpisodeListElements = (listItems: Episode[]) => {
    return listItems.map((listItem, index) => (
      <EpisodeListItem
        episode={listItem}
        key={`${keyPrefix}-${index}-${listItem?.id}`}
        podcast={listItem.podcast}
        serverCookies={serverCookies}
        showPodcastInfo
      />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episodes}`,
    description: t('pages-about_Description'),
    title: t('pages-episodes_Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader
        handleVideoOnlyModeToggle={(newStateVal) => {
          OmniAural.setGlobalFiltersVideoOnlyMode(newStateVal)
          setFilterQuery({
            ...filterQuery,
            videoOnlyMode: newStateVal
          })
          const globalFilters = cookies.globalFilters || {}
          setCookie(
            'globalFilters',
            {
              ...globalFilters,
              videoOnlyMode: newStateVal
            },
            { path: PV.Cookies.path }
          )
        }}
        primaryOnChange={_handlePrimaryOnChange}
        primaryOptions={PV.Filters.dropdownOptions.episodes.from}
        primarySelected={filterFrom}
        sortOnChange={_handleSortOnChange}
        sortOptions={
          filterFrom === PV.Filters.from._subscribed
            ? PV.Filters.dropdownOptions.episodes.sort.subscribed
            : PV.Filters.dropdownOptions.episodes.sort.all
        }
        sortSelected={filterSort}
        text={pageHeaderText}
        videoOnlyMode={videoOnlyMode}
      />
      <PageScrollableContent noPaddingTop={showLoginMessage || isCategoryPage}>
        {!showLoginMessage && !isCategoryPage && (
          <SearchBarFilter
            eventType='episodes'
            handleClear={_handleSearchClear}
            handleSubmit={_handleSearchSubmit}
            includeBottomPadding={isCategoriesPage}
            placeholder={t('Search episodes')}
          />
        )}
        {isCategoriesPage && (
          <Tiles
            groupAriaLabel={t('Categories')}
            items={categories}
            onClick={(id: string) => {
              setFilterQuery({
                ...filterQuery,
                filterCategoryId: id,
                filterPage: 1
              })
              const selectedCategory = getCategoryById(id)
              router.push(`${PV.RoutePaths.web.episodes}?category=${selectedCategory.slug}`)
            }}
          />
        )}
        {showLoginMessage && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToSubscribeToPodcasts')}
          />
        )}
        {(isLoggedInSubscribedPage || filterFrom === PV.Filters.from._all || isCategoryPage) && (
          <>
            <List
              handleSelectByCategory={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[2]])}
              handleShowAllPodcasts={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[0]])}
              hideNoResultsMessage={isQuerying}
              isSubscribedFilter={filterFrom === PV.Filters.from._subscribed}
            >
              {generateEpisodeListElements(episodesListData)}
            </List>
            <Pagination
              currentPageIndex={filterPage}
              handlePageNavigate={(newPage) =>
                setFilterQuery({
                  ...filterQuery,
                  filterPage: newPage
                })
              }
              handlePageNext={() => {
                if (filterPage + 1 <= pageCount)
                  setFilterQuery({
                    ...filterQuery,
                    filterPage: filterPage + 1
                  })
              }}
              handlePagePrevious={() => {
                if (filterPage - 1 > 0)
                  setFilterQuery({
                    ...filterQuery,
                    filterPage: filterPage - 1
                  })
              }}
              pageCount={pageCount}
              show={pageCount > 1}
            />
          </>
        )}
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { category: categorySlug } = query
  const selectedCategory = getCategoryBySlug(categorySlug as string)
  const serverCategoryId = selectedCategory?.id || null

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverGlobalFilters, serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo && !selectedCategory ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort =
    serverUserInfo && !selectedCategory ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastWeek

  const serverFilterPage = 1

  let episodesListData = []
  let episodesListDataCount = 0
  if (selectedCategory) {
    const response = await getEpisodesByQuery({
      categories: [serverCategoryId],
      includePodcast: true,
      sort: serverFilterSort,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    episodesListData = response.data[0]
    episodesListDataCount = response.data[1]
  } else if (serverUserInfo) {
    const response = await getEpisodesByQuery({
      includePodcast: true,
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    episodesListData = response.data[0]
    episodesListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverCategoryId,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverEpisodesListData: episodesListData,
    serverEpisodesListDataCount: episodesListDataCount
  }

  return { props: serverProps }
}
