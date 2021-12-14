import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Podcast } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastListItem,
  scrollToTopOfPageScrollableContent,
  SearchBarHome
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { useRouter } from 'next/router'

interface ServerProps extends Page {
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverPodcastsListData: Podcast[]
  serverPodcastsListDataCount: number
}

const keyPrefix = 'pages_podcasts'

export default function Podcasts({
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverPodcastsListData,
  serverPodcastsListDataCount
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>(serverPodcastsListData)
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(serverPodcastsListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef(true)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        const { data } = await clientQueryPodcasts()
        const [newListData, newListCount] = data
        setPodcastsListData(newListData)
        setPodcastsListDataCount(newListCount)
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterFrom, filterSort, filterPage])

  /* Client-Side Queries */

  const clientQueryPodcasts = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryPodcastsAll()
    } else if (filterFrom === PV.Filters.from._subscribed) {
      return clientQueryPodcastsBySubscribed()
    }
  }

  const clientQueryPodcastsAll = async () => {
    const finalQuery = {
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }
    return getPodcastsByQuery(finalQuery)
  }

  const clientQueryPodcastsBySubscribed = async () => {
    const subscribedPodcastIds = userInfo?.subscribedPodcastIds || []
    const finalQuery = {
      podcastIds: subscribedPodcastIds,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }
    return getPodcastsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterFrom) setFilterPage(1)
    setFilterFrom(selectedItem.key)
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterSort) setFilterPage(1)
    setFilterSort(selectedItem.key)
  }

  /* Render Helpers */

  const generatePodcastListElements = (listItems: Podcast[]) => {
    return listItems.map((listItem, index) => <PodcastListItem key={`${keyPrefix}-${index}`} podcast={listItem} />)
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
        noMarginBottom={podcastsListDataCount}
        primaryOnChange={_handlePrimaryOnChange}
        primaryOptions={PV.Filters.dropdownOptions.podcasts.from}
        primarySelected={filterFrom}
        sortOnChange={_handleSortOnChange}
        sortOptions={PV.Filters.dropdownOptions.podcasts.sort.subscribed}
        sortSelected={filterSort}
        text={t('Podcasts')}
      />
      <PageScrollableContent noMarginTop>
        {!podcastsListDataCount && <SearchBarHome />}
        {(userInfo || filterFrom !== PV.Filters.from._subscribed) && (
          <>
            <List noMarginTop>{generatePodcastListElements(podcastsListData)}</List>
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

  const serverFilterFrom = PV.Filters.from._subscribed
  const serverFilterSort = PV.Filters.sort._alphabetical

  const serverFilterPage = 1

  const response = await getPodcastsByQuery({
    podcastIds: serverUserInfo?.subscribedPodcastIds,
    sort: serverFilterSort
  })

  const [podcastsListData, podcastsListDataCount] = response.data

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
