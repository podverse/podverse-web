import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural, { useOmniAural, useOmniAuralEffect } from 'omniaural'
import type { Podcast } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import {
  Footer,
  List,
  MessageWithAction,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastListItem,
  scrollToTopOfPageScrollableContent,
  SearchBarFilter,
  Tiles
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug } from '~/services/category'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverIsHomePage: boolean
  serverPodcastsListData: Podcast[]
  serverPodcastsListDataCount: number
}

const keyPrefix = 'pages_podcasts'

export default function Podcasts({
  serverCategoryId,
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverGlobalFilters,
  serverIsHomePage,
  serverPodcastsListData,
  serverPodcastsListDataCount
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

  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>(serverPodcastsListData)
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(serverPodcastsListDataCount)
  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const initialRender = useRef(true)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const isCategoryPage = !!router.query?.category
  const isCategoriesPage = filterFrom === PV.Filters.from._category && !isCategoryPage
  const isLoggedInSubscribedPage = userInfo && filterFrom === PV.Filters.from._subscribed
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Podcasts')} > ${selectedCategory.title}` : t('Podcasts')
  const showLoginMessage = !userInfo && filterFrom === PV.Filters.from._subscribed

  /* useEffects */

  const handleEffect = () => {
    ;(async () => {
      try {
        if (initialRender.current) {
          initialRender.current = false
        } else {
          OmniAural.pageIsLoadingShow()
          setIsQuerying(true)

          const { data } = await clientQueryPodcasts()
          const [newListData, newListCount] = data
          setPodcastsListData(newListData)
          setPodcastsListDataCount(newListCount)
        }
      } catch (err) {
        console.log(err)
      }

      OmniAural.pageIsLoadingHide()
      setIsQuerying(false)
      scrollToTopOfPageScrollableContent()
    })()
  }

  useOmniAuralEffect(() => {
    const newStateVal = OmniAural.state.globalFilters.videoOnlyMode.value()
    setFilterQuery({
      ...filterQuery,
      videoOnlyMode: newStateVal
    })

    const globalFilters = cookies.globalFilters || {}
    setCookie('globalFilters', {
      ...globalFilters,
      videoOnlyMode: newStateVal
    })
  }, 'globalFilters.videoOnlyMode')

  useEffect(() => {
    handleEffect()
  }, [filterQuery])

  /* Client-Side Queries */

  const clientQueryPodcasts = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryPodcastsAll()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryPodcastsByCategory()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryPodcastsBySubscribed()
    }
  }

  const clientQueryPodcastsAll = async () => {
    const finalQuery = {
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchText: filterSearchText } : {}),
      ...(filterSearchText ? { searchBy: PV.Filters.search.queryParams.podcast } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }

    return getPodcastsByQuery(finalQuery)
  }

  const clientQueryPodcastsByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchText: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }

    return getPodcastsByQuery(finalQuery)
  }

  const clientQueryPodcastsBySubscribed = async () => {
    const finalQuery = {
      subscribed: true,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchText: filterSearchText } : {}),
      ...(filterSearchText ? { searchBy: PV.Filters.search.queryParams.podcast } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }
    return getPodcastsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.podcasts}`)
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
        filterSearchText: val
      })
    }
  }

  const _handleSearchClear = async () => {
    _handleSearchSubmit('')
  }

  /* Render Helpers */

  const generatePodcastListElements = (listItems: Podcast[]) => {
    return listItems.map((listItem, index) => (
      <PodcastListItem key={`${keyPrefix}-${index}-${listItem?.id}`} podcast={listItem} />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: serverIsHomePage ? PV.Config.WEB_BASE_URL : `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.podcasts}`,
    description: serverIsHomePage ? t('pages-index_Description') : t('pages-podcasts_Description'),
    title: serverIsHomePage ? t('pages-index_Title') : t('pages-podcasts_Title')
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
          setCookie('globalFilters', {
            ...globalFilters,
            videoOnlyMode: newStateVal
          })
        }}
        noMarginBottom={
          (filterFrom !== PV.Filters.from._category && !!podcastsListDataCount) ||
          (isCategoryPage && filterFrom === PV.Filters.from._category)
        }
        primaryOnChange={_handlePrimaryOnChange}
        primaryOptions={PV.Filters.dropdownOptions.podcasts.from}
        primarySelected={filterFrom}
        sortOnChange={_handleSortOnChange}
        sortOptions={
          filterFrom === PV.Filters.from._subscribed
            ? PV.Filters.dropdownOptions.podcasts.sort.subscribed
            : PV.Filters.dropdownOptions.podcasts.sort.all
        }
        sortSelected={filterSort}
        text={pageHeaderText}
        videoOnlyMode={videoOnlyMode}
      />
      <PageScrollableContent noPaddingTop={showLoginMessage || isCategoryPage}>
        {!showLoginMessage && !isCategoryPage && (
          <SearchBarFilter
            handleClear={_handleSearchClear}
            handleSubmit={_handleSearchSubmit}
            placeholder={t('Search podcasts')}
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
              router.push(`${PV.RoutePaths.web.podcasts}?category=${selectedCategory.slug}`)
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
              handleSelectByCategory={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.podcasts.from[2]])}
              handleShowAllPodcasts={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.podcasts.from[0]])}
              hideNoResultsMessage={isQuerying}
              isSubscribedFilter={filterFrom === PV.Filters.from._subscribed}
            >
              {generatePodcastListElements(podcastsListData)}
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

  let podcastsListData = []
  let podcastsListDataCount = 0
  if (selectedCategory) {
    const response = await getPodcastsByQuery({
      categories: [serverCategoryId],
      sort: serverFilterSort,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    podcastsListData = response.data[0]
    podcastsListDataCount = response.data[1]
  } else if (serverUserInfo) {
    const response = await getPodcastsByQuery({
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    podcastsListData = response.data[0]
    podcastsListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverCategoryId,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverIsHomePage: false,
    serverPodcastsListData: podcastsListData,
    serverPodcastsListDataCount: podcastsListDataCount
  }

  return { props: serverProps }
}
