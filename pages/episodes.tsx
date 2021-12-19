import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural, { useOmniAural, useOmniAuralEffect } from 'omniaural'
import type { Episode } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import {
  EpisodeListItem,
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
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug } from '~/services/category'
import { getEpisodesByQuery } from '~/services/episode'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverEpisodesListData: Episode[]
  serverEpisodesListDataCount: number
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
}

const keyPrefix = 'pages_episodes'

export default function Episodes({
  serverCategoryId,
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
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(serverCategoryId || null)
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [episodesListData, setListData] = useState<Episode[]>(serverEpisodesListData)
  const [episodesListDataCount, setListDataCount] = useState<number>(serverEpisodesListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const [videoOnlyMode, setVideoOnlyMode] = useState<boolean>(
    serverGlobalFilters?.videoOnlyMode || OmniAural.state.globalFilters.videoOnlyMode.value()
  )
  const initialRender = useRef(true)
  const pageCount = Math.ceil(episodesListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const isCategoryPage = !!router.query?.category
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Episodes')} > ${selectedCategory.title}` : t('Episodes')

  /* useEffects */

  useOmniAuralEffect(() => {
    const newStateVal = OmniAural.state.globalFilters.videoOnlyMode.value()
    setVideoOnlyMode(newStateVal)
    const globalFilters = cookies.globalFilters || {}
    setCookie('globalFilters', {
      ...globalFilters,
      videoOnlyMode: newStateVal
    })
  }, 'globalFilters.videoOnlyMode')

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        const { data } = await clientQueryEpisodes()
        const [newListData, newListCount] = data
        setListData(newListData)
        setListDataCount(newListCount)
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterCategoryId, filterFrom, filterSort, filterPage, videoOnlyMode])

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

  const generateEpisodeListElements = (listItems: Episode[]) => {
    return listItems.map((listItem, index) => (
      <EpisodeListItem episode={listItem} key={`${keyPrefix}-${index}`} podcast={listItem.podcast} showImage />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episodes}`,
    description: t('pages:episodes._Description'),
    title: t('pages:episodes._Title')
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
      <PageScrollableContent noMarginTop>
        {filterFrom === PV.Filters.from._category && !isCategoryPage && (
          <Tiles
            items={categories}
            onClick={(id: string) => {
              setFilterCategoryId(id)
              const selectedCategory = getCategoryById(id)
              router.push(`${PV.RoutePaths.web.episodes}?category=${selectedCategory.slug}`)
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
        {((userInfo && filterFrom === PV.Filters.from._subscribed) ||
          filterFrom === PV.Filters.from._all ||
          (filterFrom === PV.Filters.from._category && isCategoryPage)) && (
          <>
            <List hideNoResultsMessage={filterFrom === PV.Filters.from._category && !isCategoryPage}>
              {generateEpisodeListElements(episodesListData)}
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
