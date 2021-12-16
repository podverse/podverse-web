import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Podcast } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  List,
  MessageWithAction,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastListItem,
  scrollToTopOfPageScrollableContent,
  SearchBarHome,
  Tiles
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { isNotAllSortOption } from '~/resources/Filters'
import { getCategoryById, getCategoryBySlug } from '~/services/category'
import { getPodcastsByQuery } from '~/services/podcast'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

// eslint-disable-next-line
const categories = require('~/resources/Categories/TopLevelCategories.json')

interface ServerProps extends Page {
  serverCategoryId: string | null
  serverFilterFrom: string
  serverFilterPage: number
  serverFilterSort: string
  serverPodcastsListData: Podcast[]
  serverPodcastsListDataCount: number
}

const keyPrefix = 'pages_podcasts'

export default function Podcasts({
  serverCategoryId,
  serverFilterFrom,
  serverFilterPage,
  serverFilterSort,
  serverPodcastsListData,
  serverPodcastsListDataCount
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(serverCategoryId || null)
  const [filterFrom, setFilterFrom] = useState<string>(serverFilterFrom)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [podcastsListData, setPodcastsListData] = useState<Podcast[]>(serverPodcastsListData)
  const [podcastsListDataCount, setPodcastsListDataCount] = useState<number>(serverPodcastsListDataCount)
  const [userInfo] = useOmniAural('session.userInfo')
  const initialRender = useRef(true)
  const pageCount = Math.ceil(podcastsListDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const isCategoryPage = !!router.query?.category
  const selectedCategory = isCategoryPage ? getCategoryById(filterCategoryId) : null
  const pageHeaderText = selectedCategory ? `${t('Podcasts')} > ${selectedCategory.title}` : t('Podcasts')

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
  }, [filterCategoryId, filterFrom, filterSort, filterPage])

  /* Client-Side Queries */

  const clientQueryPodcasts = async () => {
    if (filterFrom === PV.Filters.from._all) {
      return clientQueryPodcastsAll()
    } else if (filterFrom === PV.Filters.from._category) {
      return clientQueryPodcastsByCategory()
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

  const clientQueryPodcastsByCategory = async () => {
    const finalQuery = {
      categories: filterCategoryId ? [filterCategoryId] : [],
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
    router.push(`${PV.RoutePaths.web.podcasts}`)
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterFrom) setFilterPage(1)

    if (selectedItem.key !== PV.Filters.from._subscribed && isNotAllSortOption(filterSort)) {
      setFilterSort(PV.Filters.sort._topPastWeek)
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
        noMarginBottom={
          (filterFrom !== PV.Filters.from._category && !!podcastsListDataCount) ||
          (isCategoryPage && filterFrom === PV.Filters.from._category)
        }
        primaryOnChange={_handlePrimaryOnChange}
        primaryOptions={PV.Filters.dropdownOptions.podcasts.from}
        primarySelected={filterFrom}
        sortOnChange={_handleSortOnChange}
        sortOptions={
          filterFrom === PV.Filters.from._subscribed
            ? PV.Filters.dropdownOptions.podcasts.sort.subscribed
            : PV.Filters.dropdownOptions.podcasts.sort.all
        }
        sortSelected={filterSort}
        text={pageHeaderText}
      />
      <PageScrollableContent noMarginTop>
        {!userInfo && filterFrom === PV.Filters.from._category && !isCategoryPage && <SearchBarHome />}
        {filterFrom === PV.Filters.from._category && !isCategoryPage && (
          <Tiles
            items={categories}
            onClick={(id: string) => {
              setFilterCategoryId(id)
              const selectedCategory = getCategoryById(id)
              router.push(`${PV.RoutePaths.web.podcasts}?category=${selectedCategory.slug}`)
            }}
          />
        )}
        {!userInfo && filterFrom === PV.Filters.from._subscribed && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToSubscribeToPodcasts')}
          />
        )}
        {(filterFrom !== PV.Filters.from._category || (filterFrom === PV.Filters.from._category && isCategoryPage)) && (
          <>
            <List hideNoResultsMessage noMarginTop>
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
            />
          </>
        )}
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { category: categorySlug } = query
  const selectedCategory = getCategoryBySlug(categorySlug as string)
  const serverCategoryId = selectedCategory?.id || null

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps

  const serverFilterFrom = serverUserInfo && !selectedCategory ? PV.Filters.from._subscribed : PV.Filters.from._category
  const serverFilterSort = serverUserInfo && !selectedCategory ? PV.Filters.sort._mostRecent : PV.Filters.sort._topPastWeek

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
