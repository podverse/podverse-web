import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage, HeaderNavTabs } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getCategoriesByQuery, handlePageEpisodesQuery, handlePageMediaRefsQuery,
  handlePagePodcastsQuery } from '~/services'
import { withTranslation } from '~/../i18n'
const { BASE_URL, CATEGORY_ID_DEFAULT } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  listItems?: any
  pageKey: string
  pages?: any
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  settings?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { defaultHomepageTab } = settings

    let pageKey = 'clips'
    if (defaultHomepageTab === 'episodes') {
      pageKey = 'episodes'
    } else if (defaultHomepageTab === 'podcasts') {
      pageKey = 'podcasts'
    }

    const localStorageQuery = cookieGetQuery(req, pageKey)
    const currentPage = pages[pageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId || CATEGORY_ID_DEFAULT
    const queryFrom = currentPage.queryFrom || query.from || (query.categoryId && PV.queryParams.from_category) || localStorageQuery.from || PV.queryParams.all_podcasts
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.top_past_week
    const queryType = (queryRefresh && query.type) || currentPage.queryType || query.type ||
      localStorageQuery.type
    let podcastId = ''

    if (queryFrom === PV.queryParams.subscribed_only) {
      podcastId = user.subscribedPodcastIds
    }

    const queryObj = {
      categoryId,
      currentPage,
      nowPlayingItem,
      pageIsLoading,
      pagesSetQueryState,
      podcastId,
      queryFrom,
      queryPage,
      queryRefresh,
      querySort,
      queryType,
      store
    }

    if (defaultHomepageTab === 'podcasts') {
      await handlePagePodcastsQuery(queryObj)
    } else if (defaultHomepageTab === 'episodes') {
      await handlePageEpisodesQuery(queryObj)
    } else {
      await handlePageMediaRefsQuery(queryObj)
    }

    const namespacesRequired = PV.nexti18next.namespaces

    return {
      allCategories, lastScrollPosition, namespacesRequired, pageKey,
      queryFrom, queryPage, querySort, queryType
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { settings } = this.props
    const { defaultHomepageTab } = settings
    if (defaultHomepageTab === 'episodes' || defaultHomepageTab === 'clips') {
      const { playerQueue } = this.props
      const { secondaryItems } = playerQueue
      clearItemsFromSecondaryQueueStorage()
      addItemsToSecondaryQueueStorage(secondaryItems)
    }
  }

  toggleAdvancedFilter = async () => {
    const { pageKey, pagesSetQueryState, pages } = this.props
    const { isAdvancedFilterShowing } = pages[pageKey]

    pagesSetQueryState({
      pageKey,
      isAdvancedFilterShowing: !isAdvancedFilterShowing
    })
  }

  render() {
    const { allCategories, categoryId, pageKey, pages, pagesSetQueryState, queryFrom,
      queryPage, querySort, queryType, t } = this.props
    const { isAdvancedFilterShowing } = pages[pageKey]

    const meta = {
      currentUrl: BASE_URL,
      description: t('pages:index._Description'),
      title: t('pages:index._Title')
    }

    return (
      <Fragment>
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
        <HeaderNavTabs
          handleLinkClick={pageIsLoading}
          handleToggleAdvancedFilter={this.toggleAdvancedFilter}
          isAdvancedFilterShowing={isAdvancedFilterShowing}
          items={PV.homeHeaderButtons(pageKey, t)}
          t={t} />
        {
          (pageKey === 'podcasts') &&
            <PodcastListCtrl
              allCategories={allCategories}
              categoryId={categoryId}
              pageIsLoading={pageIsLoading}
              pageKey={pageKey}
              queryFrom={queryFrom}
              queryPage={queryPage}
              querySort={querySort} />
        }
        {
          (pageKey === 'episodes' || pageKey === 'clips') &&
            <MediaListCtrl
              allCategories={allCategories}
              categoryId={categoryId}
              handleSetPageQueryState={pagesSetQueryState}
              pageKey={pageKey}
              queryFrom={queryFrom}
              queryPage={queryPage}
              querySort={querySort}
              queryType={queryType} />
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Home))
