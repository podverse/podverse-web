import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategoriesByQuery, getPodcastsByQuery } from '~/services'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl';
import { bindActionCreators } from 'redux';

type Props = {
  allCategories?: any[]
  categoryId?: string
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: string
  queryPage: number
  querySort?: any
}

type State = {}

const kPageKey = 'podcasts'

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, store }) {
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings

    const allCategoriesResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesResult.data || []

    const currentPage = pages[kPageKey] || {}
    const categoryId = currentPage.categoryId || query.categoryId
    const queryPage = currentPage.queryPage || query.page || 1
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
        querySort,
      }))
    }

    store.dispatch(pageIsLoading(false))

    return { allCategories, categoryId, queryPage, querySort, user }
  }

  render() {
    const { allCategories, categoryId, pagesSetQueryState, queryFrom, queryPage,
      querySort } = this.props
    
    return (
      <PodcastListCtrl 
        allCategories={allCategories}
        categoryId={categoryId}
        handleSetPageQueryState={pagesSetQueryState}
        pageKey={kPageKey}
        queryFrom={queryFrom}
        queryPage={queryPage}
        querySort={querySort} />
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Podcasts)
