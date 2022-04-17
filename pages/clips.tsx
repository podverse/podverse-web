import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural, { useOmniAural /* useOmniAuralEffect */ } from 'omniaural'
import type { MediaRef } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
// import { useCookies } from 'react-cookie'
import {
  ClipListItem,
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
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug } from '~/services/category'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')
interface ServerProps extends Page {
  serverCategoryId: string | null
  serverClipsListData: MediaRef[]
  serverClipsListDataCount: number
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
}

const keyPrefix = 'pages_clips'

export default function Clips({
  serverCategoryId,
  serverClipsListData,
  serverClipsListDataCount,
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort
}: // serverGlobalFilters
ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  // const [cookies, setCookie, removeCookie] = useCookies([])

  const [filterQuery, setFilterQuery] = useState<any>({
    filterCategoryId: serverCategoryId || null,
    filterFrom: serverFilterFrom,
    filterPage: serverFilterPage,
    filterSearchText: '',
    filterSort: serverFilterSort
    // videoOnlyMode: serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  })
  const { filterCategoryId, filterFrom, filterPage, filterSearchText, filterSort /* videoOnlyMode */ } = filterQuery
  const [tempFilterQuery, setTempFilterQuery] = useState<any>({
    tempFilterEnabled: false,
    tempFilterFrom: serverFilterFrom,
    tempFilterSort: serverFilterSort
  })
  const { tempFilterEnabled, tempFilterFrom, tempFilterSort } = tempFilterQuery

  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClipsListData)
  const [clipsListDataCount, setClipsListDataCount] = useState<number>(serverClipsListDataCount)
  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const initialRender = useRef<boolean>(true)
  const pageCount = Math.ceil(clipsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const isCategoryPage = !!router.query?.category
  const isCategoriesPage = filterFrom === PV.Filters.from._category && !isCategoryPage
  const isLoggedInSubscribedPage = userInfo && filterFrom === PV.Filters.from._subscribed
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Clips')} > ${selectedCategory.title}` : t('Clips')
  const showLoginMessage = !userInfo && filterFrom === PV.Filters.from._subscribed

  /* useEffects */

  // useOmniAuralEffect(() => {
  //   const newStateVal = OmniAural.state.globalFilters.videoOnlyMode.value()
  //   setVideoOnlyMode(newStateVal)
  //   const globalFilters = cookies.globalFilters || {}
  //   setCookie('globalFilters', {
  //     ...globalFilters,
  //     videoOnlyMode: newStateVal
  //   })
  // }, 'globalFilters.videoOnlyMode')

  useEffect(() => {
    ;(async () => {
      try {
        if (initialRender.current) {
          initialRender.current = false
        } else {
          OmniAural.pageIsLoadingShow()
          setIsQuerying(true)

          const { data } = await clientQueryMediaRefs()
          const [newListData, newListCount] = data
          setClipsListData(newListData)
          setClipsListDataCount(newListCount)
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

  const clientQueryMediaRefs = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryMediaRefsAll()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryPodcastsByCategory()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryMediaRefsBySubscribed()
    }
  }

  const clientQueryMediaRefsAll = async () => {
    const finalQuery = {
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      // ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getMediaRefsByQuery(finalQuery)
  }

  const clientQueryPodcastsByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      // ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }

    return getMediaRefsByQuery(finalQuery)
  }

  const clientQueryMediaRefsBySubscribed = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery = {
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      // ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getMediaRefsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.clips}`)
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

  const generateClipListElements = (listItems: MediaRef[]) => {
    return listItems.map((listItem, index) => (
      <ClipListItem
        episode={listItem.episode}
        isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
        key={`${keyPrefix}-${index}-${listItem?.id}`}
        mediaRef={listItem}
        podcast={listItem.episode.podcast}
        showImage
      />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clips}`,
    description: t('pages-clips_Description'),
    title: t('pages-clips_Title')
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
        // handleVideoOnlyModeToggle={(newStateVal) => {
        //   OmniAural.setGlobalFiltersVideoOnlyMode(newStateVal)
        //   setVideoOnlyMode(newStateVal)
        //   const globalFilters = cookies.globalFilters || {}
        //   setCookie('globalFilters', {
        //     ...globalFilters,
        //     videoOnlyMode: newStateVal
        //   })
        // }}
        primaryOnChange={_handlePrimaryOnChange}
        primaryOptions={PV.Filters.dropdownOptions.clips.from}
        primarySelected={filterFrom}
        sortOnChange={_handleSortOnChange}
        sortOptions={
          filterFrom === PV.Filters.from._subscribed
            ? PV.Filters.dropdownOptions.clips.sort.subscribed
            : PV.Filters.dropdownOptions.clips.sort.all
        }
        sortSelected={filterSort}
        text={pageHeaderText}
        // videoOnlyMode={videoOnlyMode}
      />
      <PageScrollableContent noPaddingTop={showLoginMessage || isCategoryPage}>
        {!showLoginMessage && !isCategoryPage && (
          <SearchBarFilter
            handleClear={_handleSearchClear}
            handleSubmit={_handleSearchSubmit}
            includeBottomPadding={!isCategoriesPage}
            placeholder={t('Search clips')}
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
              router.push(`${PV.RoutePaths.web.clips}?category=${selectedCategory.slug}`)
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
              handleSelectByCategory={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.clips.from[2]])}
              handleShowAllPodcasts={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.clips.from[0]])}
              hideNoResultsMessage={isQuerying || (filterFrom === PV.Filters.from._category && !isCategoryPage)}
              isSubscribedFilter={filterFrom === PV.Filters.from._subscribed}
            >
              {generateClipListElements(clipsListData)}
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
  const { /* serverGlobalFilters, */ serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo && !selectedCategory ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort =
    serverUserInfo && !selectedCategory ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastWeek

  const serverFilterPage = 1

  let clipsListData = []
  let clipsListDataCount = 0
  if (selectedCategory) {
    const response = await getMediaRefsByQuery({
      categories: [serverCategoryId],
      includeEpisode: true,
      includePodcast: true,
      sort: serverFilterSort
      // hasVideo: serverGlobalFilters.videoOnlyMode
    })
    clipsListData = response.data[0]
    clipsListDataCount = response.data[1]
  } else if (serverUserInfo) {
    const response = await getMediaRefsByQuery({
      includeEpisode: true,
      includePodcast: true,
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort
      // hasVideo: serverGlobalFilters.videoOnlyMode
    })
    clipsListData = response.data[0]
    clipsListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverCategoryId,
    serverClipsListData: clipsListData,
    serverClipsListDataCount: clipsListDataCount,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort
  }

  return { props: serverProps }
}
