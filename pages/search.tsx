import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Podcast } from 'podverse-shared'
import { useEffect, useState } from 'react'
import {
  Footer,
  List,
  Meta,
  PageHeaderWithTabs,
  PageScrollableContent,
  Pagination,
  PodcastListItem,
  SearchPageInput
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverCookies: any
  serverSearchByText?: string
}

const keyPrefix = 'pages_search'

/* Client-Side Queries */

const clientQueryPodcasts = async (filterSearchByText: string, filterPage: number, filterSearchByType: string) => {
  let response = {
    data: [[], 0]
  } as any

  // search endpoint requires at least 2 characters to search, otherwise it will 400
  if (filterSearchByText && filterSearchByText.length > 1) {
    const finalQuery = {
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchByType ? { searchBy: filterSearchByType } : {}),
      searchText: filterSearchByText
    }
    response = await getPodcastsByQuery(finalQuery)
  }

  return response
}

/* *TODO*
    On navigate back to this page (both using the web browser back button,
      and the in-app back button), the screen does not remember the search results,
      or the search query. I'm not sure how right now, but the previous data
      should still be there on navigate back.
*/

export default function Search({ serverCookies, serverSearchByText }: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [page] = useOmniAural('page') as [OmniAuralState['page']]
  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>([])
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(0)
  const [filterPage, setFilterPage] = useState<number>(1)
  const [filterSearchByText, setFilterSearchByText] = useState<string>(serverSearchByText || '')
  const [filterSearchByType, setFilterSearchByType] = useState<string>(PV.Filters.search.queryParams.podcast)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      if (filterSearchByText) {
        const { data } = await clientQueryPodcasts(filterSearchByText, filterPage, filterSearchByType)
        const [newPodcastsListData, newPodcastsListCount] = data
        setPodcastsListData(newPodcastsListData)
        setPodcastsListDataCount(newPodcastsListCount)
      }
    })()
  }, [])

  // Automatically search as the user types
  // TODO: Need to handle aborting any pending requests if we get updated search params
  useEffect(() => {
    ;(async () => {
      OmniAural.pageIsLoadingShow()
      const { data } = await clientQueryPodcasts(filterSearchByText, filterPage, filterSearchByType)
      const [newPodcastsListData, newPodcastsListCount] = data
      setPodcastsListData(newPodcastsListData)
      setPodcastsListDataCount(newPodcastsListCount)
      scrollToTopOfPageScrollableContent()
      OmniAural.pageIsLoadingHide()
    })()
  }, [filterSearchByText, filterSearchByType, filterPage])

  /* Function Helpers */

  const _handleSearchClear = () => {
    setFilterSearchByText('')
    setIsInitialLoad(true)
  }

  /* Render Helpers */

  const generateTabOptions = (t: any) => [
    { label: t('Podcasts'), key: PV.Filters.search.queryParams.podcast },
    { label: t('Hosts'), key: PV.Filters.search.queryParams.host }
  ]

  const generatePodcastListElements = (listItems: Podcast[]) => {
    return listItems.map((listItem, index) => (
      <PodcastListItem key={`${keyPrefix}-${index}-${listItem?.id}`} podcast={listItem} serverCookies={serverCookies} />
    ))
  }

  const pageHeaderTabs = generateTabOptions(t)

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.search}`,
    description: t('pages-about_Description'),
    title: t('pages-search_Title')
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
      <PageHeaderWithTabs
        keyPrefix={keyPrefix}
        onClick={(selectedKey: string) => setFilterSearchByType(selectedKey)}
        selectedKey={filterSearchByType}
        tabOptions={pageHeaderTabs}
        title={t('Search')}
      />
      <SearchPageInput
        defaultValue={serverSearchByText}
        handleSubmit={(value) => {
          if (isInitialLoad) setIsInitialLoad(false)
          setFilterSearchByText(value)
          setFilterPage(1)
        }}
        label={t('Podcast title')}
        placeholder={t('Search')}
      />
      <PageScrollableContent noPaddingTop>
        <List hideNoResultsMessage={isInitialLoad || page.isLoading}>
          {generatePodcastListElements(podcastsListData)}
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
          show={podcastsListData?.length && pageCount > 1}
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { podcastTitle } = query
  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverSearchByText: (podcastTitle as string) || ''
  }

  return { props: serverProps }
}
