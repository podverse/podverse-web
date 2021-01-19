/* NOTE! THE HOME PAGE IS AN EXACT COPY OF clips.tsx */

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { convertToNowPlayingItem } from 'podverse-shared'
import { HeaderNavTabs } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieGetQuery } from '~/lib/utility'
import {
  pageIsLoading, pagesSetQueryState
} from '~/redux/actions'
import { getCategoriesByQuery, getMediaRefsByQuery } from '~/services'
import { withTranslation } from '~/../i18n'
const { BASE_URL, CATEGORY_ID_DEFAULT } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  listItems?: any
  pageIsLoading?: any
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

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const state = store.getState()
    const { pages, user } = state

    const localStorageQuery = cookieGetQuery(req, PV.pageKeys.clips)
    const currentPage = pages[PV.pageKeys.clips] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId || CATEGORY_ID_DEFAULT
    const queryFrom = currentPage.queryFrom || query.from || (query.categoryId && PV.queryParams.from_category) || localStorageQuery.from || PV.queryParams.all_podcasts
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.top_past_week
    const queryType = (queryRefresh && query.type) || currentPage.queryType || query.type ||
      localStorageQuery.type || PV.queryParams.clips
    let podcastId = ''

    if (queryFrom === PV.queryParams.subscribed_only) {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0 || queryRefresh) {
      const results = await getMediaRefsByQuery({
        from: queryFrom,
        includePodcast: true,
        page: queryPage,
        ...(podcastId ? { podcastId } : {}),
        sort: querySort,
        type: queryType,
        ...(categoryId ? { categories: categoryId } : {}),
      })

      const listItems = results.data[0].map(x => convertToNowPlayingItem(x, null, null)) || []

      store.dispatch(pagesSetQueryState({
        pageKey: PV.pageKeys.clips,
        categoryId,
        listItems,
        listItemsTotal: results.data[1],
        queryFrom,
        queryPage,
        querySort,
        queryType,
      }))
    }

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return {
      allCategories, lastScrollPosition, namespacesRequired, pageKey: PV.pageKeys.clips,
      queryFrom, queryPage, querySort, queryType
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

  linkClick = () => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { allCategories, categoryId, pageIsLoading, pageKey, pages, pagesSetQueryState,
      queryFrom, queryPage, querySort, queryType, t } = this.props
    const { isAdvancedFilterShowing } = pages[pageKey]

    const meta = {
      currentUrl: BASE_URL,
      description: t('pages:clips._Description'),
      title: t('pages:clips._Title')
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
          items={PV.homeHeaderButtons(PV.pageKeys.clips, t)}
          t={t} />
        <MediaListCtrl
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={PV.pageKeys.clips}
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
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Home))
