import { GetServerSideProps } from 'next'
import { Podcast } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import Podcasts from './podcasts'
import { PV } from '~/resources'
import { getCategoryBySlug } from '~/services/category'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

export default Podcasts

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverPodcastsListData: Podcast[]
  serverPodcastsListDataCount: number
}

/* Server-Side Logic */
/* NOTE: This logic is identical to the getServerSideProps in /pages/podcasts.tsx */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { category: categorySlug } = query
  const selectedCategory = getCategoryBySlug(categorySlug as string)
  const serverCategoryId = selectedCategory?.id || null

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo && !selectedCategory ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort =
    serverUserInfo && !selectedCategory ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastWeek

  const serverFilterPage = 1

  let podcastsListData = []
  let podcastsListDataCount = 0
  if (selectedCategory) {
    const response = await getPodcastsByQuery({
      categories: [serverCategoryId],
      sort: serverFilterSort
    })
    podcastsListData = response.data[0]
    podcastsListDataCount = response.data[1]
  } else if (serverUserInfo) {
    const response = await getPodcastsByQuery({
      podcastIds: serverUserInfo?.subscribedPodcastIds,
      sort: serverFilterSort
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
