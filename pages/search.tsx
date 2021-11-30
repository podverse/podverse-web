import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import type { Podcast } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { List, Meta, PageHeaderWithTabs, PageScrollableContent, Pagination,
  PodcastListItem, SearchPageInput } from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getPodcastsByQuery } from '~/services/podcast'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

interface ServerProps extends Page {}

const keyPrefix = 'pages_search'

/* *TODO*
    On navigate back to this page (both using the web browser back button,
      and the in-app back button), the screen does not remember the search results,
      or the search query. I'm not sure how right now, but the previous data
      should still be there on navigate back.
*/

export default function Search(props: ServerProps) {

  /* Initialize */

  const { t } = useTranslation()
  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>([])
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(0)
  const [filterPage, setFilterPage] = useState<number>(1)
  const [filterSearchByText, setFilterSearchByText] = useState<string>('')
  const [filterSearchByType, setFilterSearchByType] = useState<string>(
    PV.Filters.search.queryParams.podcast)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  /* useEffects */

  useEffect(() => {
    (async () => {
      const { data } = await clientQueryPodcasts()
      const [newPodcastsListData, newPodcastsListCount] = data
      setPodcastsListData(newPodcastsListData)
      setPodcastsListDataCount(newPodcastsListCount)
      scrollToTopOfPageScrollableContent()
    })()
  }, [filterSearchByText, filterSearchByType, filterPage])

  /* Client-Side Queries */

  const clientQueryPodcasts = async () => {
    let response = {
      data: [[], 0]
    } as any

    if (filterSearchByText) {
      const finalQuery = {
        ...(filterPage ? { page: filterPage } : {}),
        ...(filterSearchByType ? { searchBy: filterSearchByType } : {}),
        searchText: filterSearchByText
      }
      response = await getPodcastsByQuery(finalQuery)
    }
    return response
  }

  /* Render Helpers */

  const generateTabOptions = (t: any) => [
    { label: t('Podcasts'), key: PV.Filters.search.queryParams.podcast },
    { label: t('Hosts'), key: PV.Filters.search.queryParams.host },
  ]

  const generatePodcastListElements = (listItems: Podcast[]) => {
    
    return listItems.map((listItem, index) =>
      <PodcastListItem
        key={`${keyPrefix}-${index}`}
        podcast={listItem} />
    )
  }

  const pageHeaderTabs = generateTabOptions(t)

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.search}`,
    description: t('pages:search._Description'),
    title: t('pages:search._Title')
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
      <PageHeaderWithTabs
        keyPrefix={keyPrefix}
        onClick={(selectedKey: string) => setFilterSearchByType(selectedKey)}
        selectedKey={filterSearchByType}
        tabOptions={pageHeaderTabs}
        title={t('Search')} />
      <SearchPageInput
        handleAutoSubmit={(value) => {
          setFilterSearchByText(value)
          setFilterPage(1)
        }}
        label={t('Podcast title')}
        placeholder={t('searchByPodcastTitle')} />
      <PageScrollableContent>
        <List>
          {generatePodcastListElements(podcastsListData)}
        </List>
        <Pagination
          currentPageIndex={filterPage}
          handlePageNavigate={(newPage) => setFilterPage(newPage)}
          handlePageNext={() => { if (filterPage + 1 <= pageCount) setFilterPage(filterPage + 1)}}
          handlePagePrevious={() => { if (filterPage - 1 > 0) setFilterPage(filterPage - 1) }}
          pageCount={pageCount} />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  
  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
