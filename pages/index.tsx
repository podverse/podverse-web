import { GetServerSideProps } from 'next'
import { Podcast } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import Podcasts from './podcasts'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

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
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort = serverUserInfo ? PV.Filters.sort._alphabetical : PV.Filters.sort._topPastWeek

  const serverFilterPage = 1

  let podcastsListData = []
  let podcastsListDataCount = 0
  if (serverUserInfo) {
    const response = await getPodcastsByQuery({
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort
    })
    podcastsListData = response.data[0]
    podcastsListDataCount = response.data[1]
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverFilterFrom,
    serverFilterPage,
    serverFilterSort,
    serverPodcastsListData: podcastsListData,
    serverPodcastsListDataCount: podcastsListDataCount
  }

  return { props: serverProps }
}
