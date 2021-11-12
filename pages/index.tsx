import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Podcast } from 'podverse-shared'
import Podcasts from './podcasts'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'

export default Podcasts

/* Server-side logic */
/* NOTE: This logic is identical to the getServerSideProps in /pages/podcasts.tsx */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const serverFilterFrom = PV.Filters.from._all
  const serverFilterSort = PV.Filters.sort._topPastDay

  const serverFilterPage = 1

  const podcasts = await getPodcastsByQuery({
    from: serverFilterFrom,
    sort: serverFilterSort
  })

  const data = podcasts.data as Podcast[] || [[], 0]

  return {
    props: {
      ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
      serverFilterFrom,
      serverFilterPage,
      serverFilterSort,
      serverListData: data[0] || [],
      serverListDataCount: data[1] || 0,
      serverCookies: cookies
    }
  }
}
