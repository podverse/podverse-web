import type { Podcast } from 'podverse-shared'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { List, PageHeader, PageScrollableContent, Pagination, PodcastListItem } from '~/components'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'

type Props = {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverListData: Podcast[]
  serverListDataCount: number
}

type FilterState = {
  filterFrom?: string
  filterPage?: number
  filterSort?: string
}

const keyPrefix = 'pages_podcasts'

export default function Podcasts(props: Props) {
  const { serverFilterFrom, serverFilterPage, serverFilterSort,
    serverListData, serverListDataCount } = props

  const router = useRouter()
  const { t } = useTranslation()

  const [filterState, setFilterState] = useState({
    filterFrom: serverFilterFrom,
    filterSort: serverFilterSort,
    filterPage: serverFilterPage
  } as FilterState)
  const { filterFrom, filterPage, filterSort } = filterState
  const [listData, setListData] = useState<Podcast[]>(serverListData)
  const [listDataCount, setListDataCount] = useState<number>(serverListDataCount)

  const pageCount = Math.ceil(listDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  const pageTitle = router.pathname == PV.RoutePaths.web.podcasts
    ? t('Podcasts')
    : t('Podverse')

  useEffect(() => {
    (async () => {
      const { data } = await clientQueryPodcasts(
        { from: filterFrom, page: filterPage, sort: filterSort },
        filterState
      )
      const newListData = data[0]
      const newListCount = data[1]
      setListData(newListData)
      setListDataCount(newListCount)
    })()
  }, [filterFrom, filterSort, filterPage])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader
        primaryOnChange={(selectedItems: any[]) => {
          const selectedItem = selectedItems[0]
          setFilterState({ filterFrom: selectedItem.key, filterPage: 1, filterSort })
        }}
        primaryOptions={generateFromOptions(t)}
        primarySelected={filterFrom}
        sortOnChange={(selectedItems: any[]) => {
          const selectedItem = selectedItems[0]
          setFilterState({ filterFrom, filterPage: 1, filterSort: selectedItem.key })
        }}
        sortOptions={generateSortOptions(t)}
        sortSelected={filterSort}
        text={t('Podcasts')} />
      <PageScrollableContent>
        <List>
          {generatePodcastListElements(listData)}
        </List>
        <Pagination
          currentPageIndex={filterPage}
          handlePageNavigate={(newPage) => {
            setFilterState({ filterFrom, filterPage: newPage, filterSort })
          }}
          handlePageNext={() => {
            const newPage = filterPage + 1
            if (newPage <= pageCount) {
              setFilterState({ filterFrom, filterPage: newPage, filterSort })
            }
          }}
          handlePagePrevious={() => {
            const newPage = filterPage - 1
            if (newPage > 0) {
              setFilterState({ filterFrom, filterPage: newPage, filterSort })
            }
          }}
          pageCount={pageCount} />
      </PageScrollableContent>
    </>
  )
}

/* Server-side logic */

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
      serverSideCookies: cookies
    }
  }
}

/* Client-side logic */

type ClientQueryPodcasts = {
  from?: string
  page?: number
  sort?: string
}

const clientQueryPodcasts = async (
  { from, page, sort }: ClientQueryPodcasts,
  filterState: FilterState
) => {
  const finalQuery = {
    ...(from ? { from } : { from: filterState.filterFrom }),
    ...(page ? { page } : { page: filterState.filterPage }),
    ...(sort ? { sort } : { sort: filterState.filterSort })
  }
  return getPodcastsByQuery(finalQuery)
}

/* Helpers */

const generateFromOptions = (t: any) => [
  { label: t('All'), key: PV.Filters.from._all },
  { label: t('Subscribed'), key: PV.Filters.from._subscribed },
  { label: t('Categories'), key: PV.Filters.from._category }
]

const generateSortOptions = (t: any) => [
  // { label: t('Recent'), key: PV.Filters.sort._mostRecent },
  { label: t('Top - Past Day'), key: PV.Filters.sort._topPastDay },
  { label: t('Top - Past Week'), key: PV.Filters.sort._topPastWeek },
  { label: t('Top - Past Month'), key: PV.Filters.sort._topPastMonth },
  { label: t('Top - Past Year'), key: PV.Filters.sort._topPastYear },
  { label: t('Top - All Time'), key: PV.Filters.sort._topAllTime }
  // { label: t('Oldest'), key: PV.Filters.sort._oldest }
]

const generatePodcastListElements = (listItems: Podcast[]) => {
  return listItems.map((listItem, index) =>
    <PodcastListItem
      key={`${keyPrefix}-${index}`}
      podcast={listItem} />
  )
}
