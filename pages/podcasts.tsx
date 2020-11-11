import { HeaderNavTabs } from 'podverse-ui'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getCategoriesByQuery, handlePagePodcastsQuery } from '~/services'
import { withTranslation } from '~/../i18n'
const { BASE_URL, CATEGORY_ID_DEFAULT } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  pageIsLoading?: boolean
  pageKey: string
  pages?: any
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: string
  queryPage: number
  querySort?: any
  t?: any
}

type State = {}

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { pages, user } = state
    const { subscribedPodcastIds } = user

    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const localStorageQuery = cookieGetQuery(req, PV.pageKeys.podcasts)

    const currentPage = pages[PV.pageKeys.podcasts] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId || CATEGORY_ID_DEFAULT
    const queryPage = (queryRefresh && 1) || query.page || currentPage.queryPage || 1
    const queryFrom = query.from
      || (query.categoryId && PV.queryParams.from_category)
      || currentPage.queryFrom
      || localStorageQuery.from
      || PV.queryParams.all_podcasts
    const querySort = query.sort || currentPage.querySort || localStorageQuery.sort || PV.queryParams.top_past_week

    const queryObj = {
      categoryId,
      currentPage,
      pageIsLoading,
      pagesSetQueryState,
      podcastId: subscribedPodcastIds,
      queryFrom,
      queryPage,
      queryRefresh,
      querySort,
      store
    }

    await handlePagePodcastsQuery(queryObj)
  
    const namespacesRequired = PV.nexti18next.namespaces

    return { allCategories, categoryId, lastScrollPosition, namespacesRequired, 
      pageKey: PV.pageKeys.podcasts, queryFrom, queryPage, querySort, user }
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
    const { allCategories, categoryId, pageKey, pageIsLoading, pages, queryFrom,
      queryPage, querySort, t } = this.props
    const { isAdvancedFilterShowing } = pages[pageKey]

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.podcasts,
      description: t('pages:podcasts._Description'),
      title: t('pages:podcasts._Title')
    }
    
    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <HeaderNavTabs
          handleLinkClick={pageIsLoading}
          handleToggleAdvancedFilter={this.toggleAdvancedFilter}
          isAdvancedFilterShowing={isAdvancedFilterShowing}
          items={PV.homeHeaderButtons(pageKey, t)}
          t={t} />
        <PodcastListCtrl 
          allCategories={allCategories}
          categoryId={categoryId}
          pageIsLoading={pageIsLoading}
          pageKey={pageKey}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort} />
      </Fragment>
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Podcasts))
