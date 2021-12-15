import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
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
import { getEpisodesByQuery } from '~/services/episode'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

import { getCategoryById } from '~/services/category'
import { isNotAllSortOption } from '~/resources/Filters'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')

interface ServerProps extends Page {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverEpisodesListData: Episode[]
  serverEpisodesListDataCount: number
}

const keyPrefix = 'pages_episodes'

export default function Episodes({
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverEpisodesListData,
  serverEpisodesListDataCount
}: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [episodesListData, setListData] = useState<Episode[]>(serverEpisodesListData)
  const [episodesListDataCount, setListDataCount] = useState<number>(serverEpisodesListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef(true)
  const pageCount = Math.ceil(episodesListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const selectedCategory = getCategoryById(filterCategoryId)
  const pageHeaderText = selectedCategory ? `${t('Episodes')} > ${selectedCategory.title}` : t('Episodes')

  /* useEffects */

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
  }, [filterCategoryId, filterFrom, filterSort, filterPage])

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
      includePodcast: true
    }
    return getEpisodesByQuery(finalQuery)
  }

  const clientQueryEpisodesByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
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
      includePodcast: true
    }
    return getEpisodesByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterFrom) setFilterPage(1)

    if (selectedItem.key !== PV.Filters.from._subscribed && isNotAllSortOption(filterSort)) {
      setFilterSort(PV.Filters.sort._topPastDay)
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
      />
      <PageScrollableContent noMarginTop>
        {filterFrom === PV.Filters.from._category && !filterCategoryId && (
          <Tiles items={categories} onClick={(id: string) => setFilterCategoryId(id)} />
        )}
        {!userInfo && filterFrom === PV.Filters.from._subscribed && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToSubscribeToPodcasts')}
          />
        )}
        {(userInfo || filterFrom !== PV.Filters.from._subscribed) && (
          <>
            <List hideNoResultsMessage>{generateEpisodeListElements(episodesListData)}</List>
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
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort = serverUserInfo ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastDay

  const serverFilterPage = 1

  let episodesListData = []
  let episodesListDataCount = 0
  if (serverUserInfo) {
    const response = await getEpisodesByQuery({
      includePodcast: true,
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort
    })
    episodesListData = response.data[0]
    episodesListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverEpisodesListData: episodesListData,
    serverEpisodesListDataCount: episodesListDataCount
  }

  return { props: serverProps }
}
