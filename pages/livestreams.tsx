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
  Tiles
} from '~/components'
import { Page } from '~/lib/utility/page'
import { determinePageCount } from '~/lib/utility/pagination'
import { PV } from '~/resources'
import { getCategoryById, getCategoryBySlug, getTranslatedCategories } from '~/services/category'
import { getLiveItemsByQuery, LiveItemsQueryParams } from '~/services/liveItem'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

type LiveItemStatus = 'live' | 'pending'

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverCookies: any
  serverFilterFrom: string
  serverFilterLiveItemStatus: LiveItemStatus
  serverFilterPage: number
  serverLiveItemsListData: Episode[]
  serverLiveItemsListDataCount: number
}

const keyPrefix = 'pages_livestreams'

export default function LiveItems({
  serverCategoryId,
  serverCookies,
  serverFilterFrom,
  serverFilterLiveItemStatus,
  serverFilterPage,
  serverGlobalFilters,
  serverLiveItemsListData,
  serverLiveItemsListDataCount
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [cookies, setCookie] = useCookies([])

  const [filterQuery, setFilterQuery] = useState<any>({
    filterCategoryId: serverCategoryId || null,
    filterFrom: serverFilterFrom,
    filterLiveItemStatus: serverFilterLiveItemStatus,
    filterPage: serverFilterPage,
    videoOnlyMode: serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  })
  const { filterCategoryId, filterFrom, filterLiveItemStatus, filterPage, videoOnlyMode } = filterQuery

  const [liveItemsListData, setLiveItemsListData] = useState<Episode[]>(serverLiveItemsListData)
  const [liveItemsListDataCount, setLiveItemsListDataCount] = useState<number>(serverLiveItemsListDataCount)

  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const initialRender = useRef(true)
  const pageCount = determinePageCount(filterPage, liveItemsListData, liveItemsListDataCount)

  const isCategoryPage = !!router.query?.category
  const isCategoriesPage = filterFrom === PV.Filters.from._category && !isCategoryPage
  const isLoggedInSubscribedPage = userInfo && filterFrom === PV.Filters.from._subscribed
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Livestreams')} > ${selectedCategory.title}` : t('Livestreams')
  const showLoginMessage = !userInfo && filterFrom === PV.Filters.from._subscribed
  const hasItems = liveItemsListData && liveItemsListData.length > 0

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
    ;(async () => {
      try {
        if (initialRender.current) {
          initialRender.current = false
        } else {
          OmniAural.pageIsLoadingShow()
          setIsQuerying(true)

          const { data } = await clientQueryLiveItems(filterLiveItemStatus)
          const [newListData, newListCount] = data
          setLiveItemsListData(newListData)
          setLiveItemsListDataCount(newListCount)
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

  // "live" status queries

  const clientQueryLiveItems = async (liveItemStatus: LiveItemStatus) => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryLiveItemsAll(liveItemStatus)
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryLiveItemsByCategory(liveItemStatus)
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryLiveItemsBySubscribed(liveItemStatus)
    }
  }

  const clientQueryLiveItemsAll = async (liveItemStatus: LiveItemStatus) => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus,
      ...(filterPage ? { page: filterPage } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsByCategory = async (liveItemStatus: LiveItemStatus) => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus,
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsBySubscribed = async (liveItemStatus: LiveItemStatus) => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus,
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.livestreams}`)
    const selectedItem = selectedItems[0]

    console.log('selectedItem', selectedItem)

    setFilterQuery({
      ...filterQuery,
      filterCategoryId: null,
      filterLiveItemStatus: selectedItem.key,
      filterPage: 1,
    })
  }

  const _handleSecondaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.livestreams}`)
    const selectedItem = selectedItems[0]

    setFilterQuery({
      ...filterQuery,
      filterCategoryId: null,
      filterFrom: selectedItem.key,
      filterPage: 1,
    })
  }

  /* Render Helpers */

  const generateLiveItemsListElements = (listItems: Episode[], isLiveItemNotLive: boolean) => {
    return listItems.map((listItem, index) => (
      <EpisodeListItem
        episode={listItem}
        isLiveItemNotLive={isLiveItemNotLive}
        key={`${keyPrefix}-${index}-${listItem?.id}`}
        podcast={listItem.podcast}
        serverCookies={serverCookies}
        showPodcastInfo
      />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.livestreams}`,
    description: t('pages-about_Description'),
    title: t('pages-live-items_Title')
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
        primaryOptions={PV.Filters.dropdownOptions.livestreams.status}
        primarySelected={filterLiveItemStatus}
        secondaryOnChange={_handleSecondaryOnChange}
        secondaryOptions={PV.Filters.dropdownOptions.livestreams.from}
        secondarySelected={filterFrom}
        text={pageHeaderText}
        videoOnlyMode={videoOnlyMode}
      />
      <PageScrollableContent noPaddingTop>
        {isCategoriesPage && (
          <Tiles
            groupAriaLabel={t('Categories')}
            items={categories}
            onClick={(id: string) => {
              setFilterQuery({
                ...filterQuery,
                filterCategoryId: id,
                filterPage: 1,
              })
              const selectedCategory = getCategoryById(id)
              router.push(`${PV.RoutePaths.web.livestreams}?category=${selectedCategory.slug}`)
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
        {(isLoggedInSubscribedPage || filterFrom === PV.Filters.from._all || isCategoryPage) && hasItems && (
          <>
            <List
              handleSelectByCategory={() => _handleSecondaryOnChange([PV.Filters.dropdownOptions.episodes.from[2]])}
              handleShowAllPodcasts={() => _handleSecondaryOnChange([PV.Filters.dropdownOptions.episodes.from[0]])}
              hideNoResultsMessage={isQuerying}
              isSubscribedFilter={
                filterFrom === PV.Filters.from._subscribed && userInfo?.subscribedPodcastIds?.length === 0
              }
            >
              {generateLiveItemsListElements(liveItemsListData, false)}
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
              show={filterPage > 1 || (filterPage === 1 && liveItemsListData.length >= 20)}
            />
          </>
        )}
        {(filterFrom === PV.Filters.from._all || isLoggedInSubscribedPage || isCategoryPage) &&
          liveItemsListData &&
          liveItemsListData.length === 0 && (
            <div className='list'>
              <div className='no-results-found-message' tabIndex={0}>
                {t('No results found')}
              </div>
            </div>
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
  const { serverGlobalFilters } = defaultServerProps

  // const serverFilterFrom = serverUserInfo && !selectedCategory ? PV.Filters.from._subscribed : PV.Filters.from._all
  const serverFilterFrom = PV.Filters.from._all
  const serverFilterLiveItemStatus = 'live'

  const serverFilterPage = 1

  let liveItemsListData = []
  let liveItemsListDataCount = 0

  if (selectedCategory) {
    const responseLive = await getLiveItemsByQuery({
      liveItemStatus: 'live',
      categories: [serverCategoryId],
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListData = responseLive.data[0]
    liveItemsListDataCount = responseLive.data[1]
  } else {
    const responseLive = await getLiveItemsByQuery({
      liveItemStatus: 'live',
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListData = responseLive.data[0]
    liveItemsListDataCount = responseLive.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverCategoryId,
    serverFilterFrom,
    serverFilterLiveItemStatus,
    serverFilterPage,
    serverLiveItemsListData: liveItemsListData,
    serverLiveItemsListDataCount: liveItemsListDataCount
  }

  return { props: serverProps }
}
