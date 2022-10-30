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

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverCookies: any
  serverFilterFrom: string
  serverFilterPageLive: number
  serverFilterPagePending: number
  serverLiveItemsListDataLive: Episode[]
  serverLiveItemsListDataCountLive: number
  serverLiveItemsListDataPending: Episode[]
  serverLiveItemsListDataCountPending: number
}

const keyPrefix = 'pages_livestreams'

export default function LiveItems({
  serverCategoryId,
  serverCookies,
  serverFilterFrom,
  serverFilterPageLive,
  serverFilterPagePending,
  serverGlobalFilters,
  serverLiveItemsListDataLive,
  serverLiveItemsListDataCountLive,
  serverLiveItemsListDataPending,
  serverLiveItemsListDataCountPending
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [cookies, setCookie] = useCookies([])

  const [filterQuery, setFilterQuery] = useState<any>({
    filterCategoryId: serverCategoryId || null,
    filterFrom: serverFilterFrom,
    filterPageLive: serverFilterPageLive,
    filterPagePending: serverFilterPagePending,
    videoOnlyMode: serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  })
  const { filterCategoryId, filterFrom, filterPageLive, filterPagePending, videoOnlyMode } = filterQuery

  const [liveItemsListDataLive, setLiveItemsListDataLive] = useState<Episode[]>(serverLiveItemsListDataLive)
  const [liveItemsListDataCountLive, setLiveItemsListDataCountLive] = useState<number>(serverLiveItemsListDataCountLive)
  const [liveItemsListDataPending, setLiveItemsListDataPending] = useState<Episode[]>(serverLiveItemsListDataPending)
  const [liveItemsListDataCountPending, setLiveItemsListDataCountPending] = useState<number>(
    serverLiveItemsListDataCountPending
  )
  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const initialRender = useRef(true)
  const pageCountLive = determinePageCount(filterPageLive, liveItemsListDataLive, liveItemsListDataCountLive)
  const pageCountPending = determinePageCount(filterPagePending, liveItemsListDataPending, liveItemsListDataCountPending)
  const isCategoryPage = !!router.query?.category
  const isCategoriesPage = filterFrom === PV.Filters.from._category && !isCategoryPage
  const isLoggedInSubscribedPage = userInfo && filterFrom === PV.Filters.from._subscribed
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Livestreams')} > ${selectedCategory.title}` : t('Livestreams')
  const showLoginMessage = !userInfo && filterFrom === PV.Filters.from._subscribed
  const hasItemsLive = liveItemsListDataLive && liveItemsListDataLive.length > 0
  const hasItemsPending = liveItemsListDataPending && liveItemsListDataPending.length > 0

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

          const { data: dataLive } = await clientQueryLiveItemsLive()
          const [newListDataLive, newListCountLive] = dataLive
          setLiveItemsListDataLive(newListDataLive)
          setLiveItemsListDataCountLive(newListCountLive)

          const { data: dataPending } = await clientQueryLiveItemsPending()
          const [newListDataPending, newListCountPending] = dataPending
          setLiveItemsListDataPending(newListDataPending)
          setLiveItemsListDataCountPending(newListCountPending)
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

  const clientQueryLiveItemsLive = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryLiveItemsAllLive()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryLiveItemsByCategoryLive()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryLiveItemsBySubscribedLive()
    }
  }

  const clientQueryLiveItemsAllLive = async () => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'live',
      ...(filterPageLive ? { page: filterPageLive } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsByCategoryLive = async () => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'live',
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPageLive ? { page: filterPageLive } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsBySubscribedLive = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'live',
      podcastIds: subscribedPodcastIds,
      ...(filterPageLive ? { page: filterPageLive } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  // "pending" status queries

  const clientQueryLiveItemsPending = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryLiveItemsAllPending()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryLiveItemsByCategoryPending()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryLiveItemsBySubscribedPending()
    }
  }

  const clientQueryLiveItemsAllPending = async () => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'pending',
      ...(filterPagePending ? { page: filterPagePending } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsByCategoryPending = async () => {
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'pending',
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPagePending ? { page: filterPagePending } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  const clientQueryLiveItemsBySubscribedPending = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery: LiveItemsQueryParams = {
      liveItemStatus: 'pending',
      podcastIds: subscribedPodcastIds,
      ...(filterPagePending ? { page: filterPagePending } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {}),
      includePodcast: true
    }
    return getLiveItemsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.livestreams}`)
    const selectedItem = selectedItems[0]

    setFilterQuery({
      ...filterQuery,
      filterCategoryId: null,
      filterFrom: selectedItem.key,
      filterPageLive: 1,
      filterPagePending: 1
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
        primaryOptions={PV.Filters.dropdownOptions.episodes.from}
        primarySelected={filterFrom}
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
                filterPageLive: 1,
                filterPagePending: 1
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
        {(isLoggedInSubscribedPage || filterFrom === PV.Filters.from._all || isCategoryPage) && hasItemsLive && (
          <>
            <List
              handleSelectByCategory={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[2]])}
              handleShowAllPodcasts={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[0]])}
              hideNoResultsMessage={isQuerying}
              isSubscribedFilter={
                filterFrom === PV.Filters.from._subscribed
                && userInfo?.subscribedPodcastIds?.length === 0
              }
            >
              {generateLiveItemsListElements(liveItemsListDataLive, false)}
            </List>
            <Pagination
              currentPageIndex={filterPageLive}
              handlePageNavigate={(newPage) =>
                setFilterQuery({
                  ...filterQuery,
                  filterPageLive: newPage
                })
              }
              handlePageNext={() => {
                if (filterPageLive + 1 <= pageCountLive)
                  setFilterQuery({
                    ...filterQuery,
                    filterPageLive: filterPageLive + 1
                  })
              }}
              handlePagePrevious={() => {
                if (filterPageLive - 1 > 0)
                  setFilterQuery({
                    ...filterQuery,
                    filterPageLive: filterPageLive - 1
                  })
              }}
              pageCount={pageCountLive}
              show={filterPageLive > 1 || (filterPageLive === 1 && liveItemsListDataLive.length >= 20)}
            />
            {hasItemsLive && hasItemsPending && <hr />}
            <br />
            <br />
          </>
        )}
        {(isLoggedInSubscribedPage || filterFrom === PV.Filters.from._all || isCategoryPage) && hasItemsPending && (
          <>
            <h2>{t('Scheduled')}</h2>
            <List
              handleSelectByCategory={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[2]])}
              handleShowAllPodcasts={() => _handlePrimaryOnChange([PV.Filters.dropdownOptions.episodes.from[0]])}
              hideNoResultsMessage={isQuerying}
              isSubscribedFilter={
                filterFrom === PV.Filters.from._subscribed
                && userInfo?.subscribedPodcastIds?.length === 0
              }
            >
              {generateLiveItemsListElements(liveItemsListDataPending, true)}
            </List>
            <Pagination
              currentPageIndex={filterPagePending}
              handlePageNavigate={(newPage) =>
                setFilterQuery({
                  ...filterQuery,
                  filterPagePending: newPage
                })
              }
              handlePageNext={() => {
                if (filterPagePending + 1 <= pageCountPending)
                  setFilterQuery({
                    ...filterQuery,
                    filterPagePending: filterPagePending + 1
                  })
              }}
              handlePagePrevious={() => {
                if (filterPagePending - 1 > 0)
                  setFilterQuery({
                    ...filterQuery,
                    filterPagePending: filterPagePending - 1
                  })
              }}
              pageCount={pageCountPending}
              show={filterPagePending > 1 || (filterPagePending === 1 && liveItemsListDataPending.length >= 20)}
            />
          </>
        )}
        {(filterFrom === PV.Filters.from._all || isLoggedInSubscribedPage || isCategoryPage) &&
          liveItemsListDataLive &&
          liveItemsListDataLive.length === 0 &&
          liveItemsListDataPending &&
          liveItemsListDataPending.length === 0 && (
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

  const serverFilterPageLive = 1
  const serverFilterPagePending = 1

  let liveItemsListDataLive = []
  let liveItemsListDataCountLive = 0
  let liveItemsListDataPending = []
  let liveItemsListDataCountPending = 0
  if (selectedCategory) {
    const responseLive = await getLiveItemsByQuery({
      liveItemStatus: 'live',
      categories: [serverCategoryId],
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListDataLive = responseLive.data[0]
    liveItemsListDataCountLive = responseLive.data[1]

    const responsePending = await getLiveItemsByQuery({
      liveItemStatus: 'pending',
      categories: [serverCategoryId],
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListDataPending = responsePending.data[0]
    liveItemsListDataCountPending = responsePending.data[1]
  } else {
    const responseLive = await getLiveItemsByQuery({
      liveItemStatus: 'live',
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListDataLive = responseLive.data[0]
    liveItemsListDataCountLive = responseLive.data[1]

    const responsePending = await getLiveItemsByQuery({
      liveItemStatus: 'pending',
      includePodcast: true,
      hasVideo: serverGlobalFilters.videoOnlyMode
    })
    liveItemsListDataPending = responsePending.data[0]
    liveItemsListDataCountPending = responsePending.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverCategoryId,
    serverFilterFrom,
    serverFilterPageLive,
    serverFilterPagePending,
    serverLiveItemsListDataLive: liveItemsListDataLive,
    serverLiveItemsListDataCountLive: liveItemsListDataCountLive,
    serverLiveItemsListDataPending: liveItemsListDataPending,
    serverLiveItemsListDataCountPending: liveItemsListDataCountPending
  }

  return { props: serverProps }
}
