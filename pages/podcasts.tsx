import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getCategoriesByQuery, getPodcastsByQuery } from '~/services'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  pageIsLoading?: boolean
  pageKey?: string
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: string
  queryPage: number
  querySort?: any
  t?: any
}

type State = {}

const kPageKey = 'podcasts'

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings
    const { subscribedPodcastIds } = user

    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const localStorageQuery = cookieGetQuery(req, kPageKey)

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId
    const queryPage = (queryRefresh && 1) || query.page || currentPage.queryPage || 1
    const queryFrom = query.from
      || (query.categoryId && PV.queryParams.from_category)
      || currentPage.queryFrom
      || localStorageQuery.from
      || (user && user.id ? PV.queryParams.subscribed_only : PV.queryParams.all_podcasts)
    const querySort = query.sort || currentPage.querySort || localStorageQuery.sort || (user && user.id ? PV.queryParams.alphabetical : PV.queryParams.top_past_week)

    if (Object.keys(currentPage).length === 0 || queryRefresh) {
      const queryDataResult = await getPodcastsByQuery({
        ...(categoryId ? { categories: categoryId } : {}),
        from: queryFrom,
        page: queryPage,
        sort: querySort,
        ...(queryFrom === PV.queryParams.subscribed_only ? { subscribedPodcastIds } : {})
      })

      const podcasts = queryDataResult.data

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        categoryId,
        listItems: podcasts[0],
        listItemsTotal: podcasts[1],
        queryPage,
        queryFrom,
        querySort,
        selected: queryFrom
      }))
    }

    store.dispatch(pageIsLoading(false))

  
    const namespacesRequired = PV.nexti18next.namespaces

    return { allCategories, categoryId, lastScrollPosition, namespacesRequired, nsfwMode, 
      pageKey: kPageKey, queryFrom, queryPage, querySort, user }
  }

  render() {
    const { allCategories, categoryId, pageKey, pageIsLoading, pagesSetQueryState, queryFrom,
      queryPage, querySort, t } = this.props

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
        <h3>{t('Podcasts')}</h3>
        <PodcastListCtrl 
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
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
