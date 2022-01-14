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
  SearchBarHome,
  Tiles
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug } from '~/services/category'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
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
  serverPodcastsListData,
  serverPodcastsListDataCount
}: ServerProps) {
  /* Initialize */
  const router = useRouter()
  const { t } = useTranslation()
  const [cookies, setCookie] = useCookies([])
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(serverCategoryId || null)
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>(serverPodcastsListData)
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(serverPodcastsListDataCount)
  const [isQuerying, setIsQuerying] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo')
  const [videoOnlyMode, setVideoOnlyMode] = useState<boolean>(
    serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  )
  const initialRender = useRef(true)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const isCategoryPage = !!router.query?.category
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Podcasts')} > ${selectedCategory.title}` : t('Podcasts')

  /* useEffects */

  const handleEffect = () => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        setIsQuerying(true)

        const { data } = await clientQueryPodcasts()
        const [newListData, newListCount] = data
        setPodcastsListData(newListData)
        setPodcastsListDataCount(newListCount)

        OmniAural.pageIsLoadingHide()
        setIsQuerying(false)
        scrollToTopOfPageScrollableContent()
      }
    })()
  }

  useOmniAuralEffect(() => {
    const newStateVal = OmniAural.state.globalFilters.videoOnlyMode.value()
    setVideoOnlyMode(newStateVal)
    const globalFilters = cookies.globalFilters || {}
    setCookie('globalFilters', {
      ...globalFilters,
      videoOnlyMode: newStateVal
    })
  }, 'globalFilters.videoOnlyMode')

  // ON CATEGORY CHANGE, RESET PAGE TO 1
  useEffect(() => {
    handleEffect()
  }, [filterCategoryId, filterFrom, filterSort, filterPage, videoOnlyMode])

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
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }
    return getPodcastsByQuery(finalQuery)
  }

  const clientQueryPodcastsByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }

    return getPodcastsByQuery(finalQuery)
  }

  const clientQueryPodcastsBySubscribed = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []

    const finalQuery = {
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      ...(videoOnlyMode ? { hasVideo: true } : {})
    }
    return getPodcastsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    router.push(`${PV.RoutePaths.web.podcasts}`)
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterFrom) setFilterPage(1)

    if (selectedItem.key !== PV.Filters.from._subscribed && isNotAllSortOption(filterSort)) {
      setFilterSort(PV.Filters.sort._topPastWeek)
    }

    setFilterCategoryId(null)
    setFilterFrom(selectedItem.key)
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterSort) setFilterPage(1)
    setFilterSort(selectedItem.key)
  }

  /* Render Helpers */

  const generatePodcastListElements = (listItems: Podcast[]) => {
    return listItems.map((listItem, index) => (
      <PodcastListItem key={`${keyPrefix}-${index}-${listItem?.id}`} podcast={listItem} />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.podcasts}`,
    description: t('pages:podcasts._Description'),
    title: t('pages:podcasts._Title')
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
          setVideoOnlyMode(newStateVal)
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
      <PageScrollableContent noMarginTop>
        {!userInfo && filterFrom === PV.Filters.from._category && !isCategoryPage && <SearchBarHome />}
        {filterFrom === PV.Filters.from._category && !isCategoryPage && (
          <Tiles
            items={categories}
            onClick={(id: string) => {
              setFilterPage(1)
              setFilterCategoryId(id)
              const selectedCategory = getCategoryById(id)
              router.push(`${PV.RoutePaths.web.podcasts}?category=${selectedCategory.slug}`)
            }}
          />
        )}
        {!userInfo && filterFrom === PV.Filters.from._subscribed && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToSubscribeToPodcasts')}
          />
        )}
        {(filterFrom !== PV.Filters.from._category || (filterFrom === PV.Filters.from._category && isCategoryPage)) && (
          <>
            <List
              hideNoResultsMessage={isQuerying || (filterFrom === PV.Filters.from._category && !isCategoryPage)}
              noMarginTop
            >
              {generatePodcastListElements(podcastsListData)}
            </List>
            <Pagination
              currentPageIndex={filterPage}
              handlePageNavigate={(newPage) => setFilterPage(newPage)}
              handlePageNext={() => {
                if (filterPage + 1 <= pageCount) setFilterPage(filterPage + 1)
              }}
              handlePagePrevious={() => {
                if (filterPage - 1 > 0) setFilterPage(filterPage - 1)
              }}
              pageCount={pageCount}
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
    serverPodcastsListData: podcastsListData,
    serverPodcastsListDataCount: podcastsListDataCount
  }

  return { props: serverProps }
}
