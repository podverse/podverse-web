import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { MediaRef } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
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
import { getCategoryById } from '~/services/category'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')
interface ServerProps extends Page {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverClipsListData: MediaRef[]
  serverClipsListDataCount: number
}

const keyPrefix = 'pages_clips'

export default function Clips({
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverClipsListData,
  serverClipsListDataCount
}: ServerProps) {

  /* Initialize */

  const { t } = useTranslation()
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [clipsListData, setListData] = useState<MediaRef[]>(serverClipsListData)
  const [clipsListDataCount, setListDataCount] = useState<number>(serverClipsListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef<boolean>(true)
  const pageCount = Math.ceil(clipsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const selectedCategory = getCategoryById(filterCategoryId)
  const pageHeaderText = selectedCategory ? `${t('Clips')} > ${selectedCategory.title}` : t('Clips')

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        const { data } = await clientQueryMediaRefs()
        const [newListData, newListCount] = data
        setListData(newListData)
        setListDataCount(newListCount)
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterCategoryId, filterFrom, filterSort, filterPage])

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
      ...(filterSort ? { sort: filterSort } : {}),
      includePodcast: true
    }
    return getMediaRefsByQuery(finalQuery)
  }

  const clientQueryPodcastsByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      includePodcast: true
    }

    return getMediaRefsByQuery(finalQuery)
  }

  const clientQueryMediaRefsBySubscribed = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery = {
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {}),
      includePodcast: true
    }
    return getMediaRefsByQuery(finalQuery)
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

  const generateClipListElements = (listItems: MediaRef[]) => {
    return listItems.map((listItem, index) => (
      <ClipListItem
        episode={listItem.episode}
        isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
        key={`${keyPrefix}-${index}`}
        mediaRef={listItem}
        podcast={listItem.episode.podcast}
        showImage
      />
    ))
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clips}`,
    description: t('pages:clips._Description'),
    title: t('pages:clips._Title')
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
            <List hideNoResultsMessage>{generateClipListElements(clipsListData)}</List>
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

  let clipsListData = []
  let clipsListDataCount = 0
  if (serverUserInfo) {
    const response = await getMediaRefsByQuery({
      includeEpisode: true,
      includePodcast: true,
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort
    })

    clipsListData = response.data[0]
    clipsListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverClipsListData: clipsListData,
    serverClipsListDataCount: clipsListDataCount
  }

  return { props: serverProps }
}
