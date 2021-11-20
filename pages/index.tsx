import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Podcast } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import Podcasts from './podcasts'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getPodcastsByQuery } from '~/services/podcast'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'

export default Podcasts

interface ServerProps extends Page {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverPodcastsListData: Podcast[]
  serverPodcastsListDataCount: number
}

/* Server-Side Logic */
/* NOTE: This logic is identical to the getServerSideProps in /pages/podcasts.tsx */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)
  const userQueueItems = await getServerSideUserQueueItems(cookies)
  const serverFilterFrom = userInfo ? PV.Filters.from._subscribed : PV.Filters.from._all
  const serverFilterSort = userInfo ? PV.Filters.sort._alphabetical : PV.Filters.sort._topPastDay
  
  const serverFilterPage = 1
  let response = null
  if (userInfo) {
    response = await getPodcastsByQuery({
      podcastIds: userInfo.subscribedPodcastIds,
      sort: serverFilterSort
    })
  } else {
    response = await getPodcastsByQuery({
      sort: serverFilterSort
    })
  }
  
  const [podcastsListData, podcastsListDataCount] = response.data
  
  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverPodcastsListData: podcastsListData,
    serverPodcastsListDataCount: podcastsListDataCount,
    serverCookies: cookies
  }

  return { props: serverProps }
}
