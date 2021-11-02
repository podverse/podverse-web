import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { HeaderNavTabs } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getCategoriesByQuery, handlePageEpisodesQuery } from '~/services'
import { withTranslation } from '~/../i18n'
const { CATEGORY_ID_DEFAULT, PUBLIC_BASE_URL } = config()

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
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Episodes extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const state = store.getState()
    const { mediaPlayer, pages, user } = state
    const { nowPlayingItem } = mediaPlayer

    const localStorageQuery = cookieGetQuery(req, PV.pageKeys.episodes)

    const currentPage = pages[PV.pageKeys.episodes] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId || CATEGORY_ID_DEFAULT
    const queryFrom = currentPage.queryFrom || query.from || (query.categoryId && PV.queryParams.from_category) || localStorageQuery.from || PV.queryParams.all_podcasts
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.top_past_week
    const queryType = (queryRefresh && query.type) || currentPage.queryType || query.type ||
      localStorageQuery.type || PV.queryParams.episodes
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

    await handlePageEpisodesQuery(queryObj)

    const namespacesRequired = PV.nexti18next.namespaces

    return {
      allCategories, lastScrollPosition, namespacesRequired, pageKey: PV.pageKeys.episodes, queryFrom, queryPage, querySort, queryType
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
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
    const { allCategories, categoryId, pageKey, pages, pagesSetQueryState, queryFrom, queryPage,
      querySort, queryType, t } = this.props
    const { isAdvancedFilterShowing } = pages[pageKey]

    const meta = {
      currentUrl: PUBLIC_BASE_URL,
      description: t('pages:episodes._Description'),
      title: t('pages:episodes._Title'),
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
          items={PV.homeHeaderButtons(PV.pageKeys.episodes, t)}
          t={t} />
        <MediaListCtrl
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={PV.pageKeys.episodes}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Episodes))
