import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OmniAural, { useOmniAural } from 'omniaural'
import type { MediaRef } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem, List, MessageWithAction, Meta, PageHeader, PageScrollableContent, Pagination,
  scrollToTopOfPageScrollableContent
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'

interface ServerProps extends Page {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverClipsListData: MediaRef[]
  serverClipsListDataCount: number
}

const keyPrefix = 'pages_clips'

export default function Clips({ serverFilterFrom, serverFilterPage,
  serverFilterSort, serverClipsListData, serverClipsListDataCount }: ServerProps) {

  /* Initialize */

  const { t } = useTranslation()
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [clipsListData, setListData] = useState<MediaRef[]>(serverClipsListData)
  const [clipsListDataCount, setListDataCount] = useState<number>(serverClipsListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef<boolean>(true)
  const pageCount = Math.ceil(clipsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  /* useEffects */

  useEffect(() => {
    (async () => {
      if (initialRender.current) {
        initialRender.current = false;
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
  }, [filterFrom, filterSort, filterPage])

  /* Client-Side Queries */

  const clientQueryMediaRefs = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryMediaRefsAll()
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
    if (
      filterSort === PV.Filters.sort._mostRecent
      || filterSort === PV.Filters.sort._oldest
    ) {
      setFilterSort(PV.Filters.sort._topPastDay)
    }
    setFilterFrom(selectedItem.key)
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterSort) setFilterPage(1)
    setFilterSort(selectedItem.key)
  }

  /* Render Helpers */

  const generateClipListElements = (listItems: MediaRef[]) => {
    return listItems.map((listItem, index) =>
      <ClipListItem
        episode={listItem.episode}
        key={`${keyPrefix}-${index}`}
        mediaRef={listItem}
        podcast={listItem.episode.podcast}
        showImage />
    )
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
        twitterTitle={meta.title} />
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
        text={t('Clips')} />
      <PageScrollableContent noMarginTop>
        {
          !userInfo && filterFrom === PV.Filters.from._subscribed && (
            <MessageWithAction
              actionLabel={t('Login')}
              actionOnClick={() => OmniAural.modalsLoginShow()}
              message={t('LoginToSubscribeToPodcasts')} />
          )
        }
        {
          (userInfo || filterFrom !== PV.Filters.from._subscribed) && (
            <>
              <List>
                {generateClipListElements(clipsListData)}
              </List>
              <Pagination
                currentPageIndex={filterPage}
                handlePageNavigate={(newPage) => setFilterPage(newPage)}
                handlePageNext={() => { if (filterPage + 1 <= pageCount) setFilterPage(filterPage + 1)}}
                handlePagePrevious={() => { if (filterPage - 1 > 0) setFilterPage(filterPage - 1) }}
                pageCount={pageCount} />
            </>
          )
        }
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)
  const userQueueItems = await getServerSideUserQueueItems(cookies)
  const serverFilterFrom = userInfo ? PV.Filters.from._subscribed : PV.Filters.from._all
  const serverFilterSort = userInfo ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastDay
  
  const serverFilterPage = 1
  let response = null
  if (userInfo) {
    response = await getMediaRefsByQuery({
      includeEpisode: true,
      includePodcast: true,
      podcastIds: userInfo.subscribedPodcastIds,
      sort: serverFilterSort
    })
  } else {
    response = await getMediaRefsByQuery({
      includeEpisode: true,
      includePodcast: true,
      sort: serverFilterSort
    })
  }
  
  const [clipsListData, clipsListDataCount] = response.data
  
  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverClipsListData: clipsListData,
    serverClipsListDataCount: clipsListDataCount,
    serverCookies: cookies
  }

  return { props: serverProps }
}
