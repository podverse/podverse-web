import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getCategoriesByQuery, getPodcastsByQuery } from '~/services'

type Props = {
  allCategories?: any[]
  categoryId?: string
  meta?: any
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: string
  queryPage: number
  querySort?: any
}

type State = {}

const kPageKey = 'podcasts'

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings

    const allCategoriesResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesResult.data || []

    const currentPage = pages[kPageKey] || {}
    const categoryId = currentPage.categoryId || query.categoryId
    const queryPage = currentPage.queryPage || query.page || 1
    const queryFrom = currentPage.queryFrom || query.from || 'all-podcasts'
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    
    if (Object.keys(currentPage).length === 0) {
      const queryDataResult = await getPodcastsByQuery({
        ...(categoryId ? { categoryId } : {}),
        page: queryPage,
        sort: querySort
      }, nsfwMode)

      const listItems = queryDataResult.data

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        listItems,
        queryPage,
        queryFrom,
        querySort,
      }))
    }

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Podcasts on Podverse. Find and subscribe to podcasts.',
      title: `Podcasts`
    }

    return { allCategories, categoryId, meta, queryPage, querySort, user }
  }

  render() {
    const { allCategories, categoryId, meta, pagesSetQueryState, queryFrom,
      queryPage, querySort } = this.props
    
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
        <PodcastListCtrl 
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={kPageKey}
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

export default connect(mapStateToProps, mapDispatchToProps)(Podcasts)
