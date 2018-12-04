import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PVButton as Button, MediaListItem, MediaListSelect } from 'podverse-ui'
import { getQueryDataForPodcastsPage } from '~/lib/mediaListController'
import { currentPageListItemsLoading, currentPageListItemsLoadingNextPage,
  currentPageLoadListItems } from '~/redux/actions'
import { getCategoriesByQuery } from '~/services'
import { bindActionCreators } from 'redux';
const uuidv4 = require('uuid/v4')

type Props = {
  allCategories?: any
  currentPage?: any
  currentPageListItemsLoading?: any
  currentPageListItemsLoadingNextPage?: any
  playerQueue?: any
  store
}

type State = {
  queryCategoryId?: string
  queryPage: number
  querySort?: string
}

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { currentPage, user } = state
    const selectedCategoryId = query.categories

    const allCategoriesResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesResult.data
    
    const queryDataResult = await getQueryDataForPodcastsPage(
      query, user.subscribedPodcastIds, selectedCategoryId
    )

    const newData = queryDataResult.data
    let combinedData: any[] = []

    // Only keep the currentPage.listItems if beyond the first page query
    // @ts-ignore
    if (process.browser && query.page && query.page > 1) {
      const { listItems } = currentPage
      combinedData = listItems
    }

    for (const data of newData) {
      combinedData.push(data)
    }

    store.dispatch(currentPageLoadListItems({
      listItems: combinedData,
      listItemsEndReached: combinedData && newData.length === 0
    }))
    store.dispatch(currentPageListItemsLoading(false))
    store.dispatch(currentPageListItemsLoadingNextPage(false))

    return { allCategories, selectedCategoryId }
  }

  constructor (props) {
    super(props)

    this.state = {
      queryPage: 1,
      querySort: 'top-past-week'
    }

    this.queryPodcasts = this.queryPodcasts.bind(this)
  }

  queryPodcasts(selectedKey = '', selectedValue = '', page = 1) {
    const { currentPageListItemsLoading, currentPageListItemsLoadingNextPage } = this.props
    const { queryCategoryId, querySort } = this.state

    let query = {
      categories: queryCategoryId,
      page,
      sort: querySort
    }

    if (page > 1) {
      currentPageListItemsLoadingNextPage(true)
    } else {
      currentPageListItemsLoading(true)
    }

    let newState: any = { queryPage: page }

    if (selectedKey === 'categories') {
      newState.queryCategoryId = selectedValue
      query.categories = selectedValue
    } else if (selectedKey === 'sort') {
      newState.querySort = selectedValue
      query.sort = selectedValue
    } else {
      // load more, use existing query but with new page number
    }

    this.setState(newState)

    const href = `/podcasts?${query.categories ? `categories=${query.categories}` : ''}&sort=${query.sort}&page=${query.page}`
    const as = `/podcasts`
    Router.push(href, as)
  }

  getQuerySortOptions() {
    return [
      {
        label: 'top - past hour',
        onClick: () => this.queryPodcasts('sort', 'top-past-hour'),
        value: 'top-past-hour'
      },
      {
        label: 'top - past day',
        onClick: () => this.queryPodcasts('sort', 'top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.queryPodcasts('sort', 'top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.queryPodcasts('sort', 'top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.queryPodcasts('sort', 'top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.queryPodcasts('sort', 'top-all-time'),
        value: 'top-all-time'
      },
      {
        label: 'most recent',
        onClick: () => this.queryPodcasts('sort', 'most-recent'),
        value: 'most-recent'
      }
    ]
  }

  render() {
    const { allCategories, currentPage } = this.props
    const { queryCategoryId, queryPage, querySort } = this.state
    const { listItems, listItemsEndReached, listItemsLoading, listItemsLoadingNextPage } = currentPage

    const categoryItems = allCategories.map(x => {
      return {
        hasSubcategories: x.categories && x.categories.length > 0,
        label: x.title,
        onClick: () => this.queryPodcasts('categories', x.id),
        parentValue: (x.category && x.category.id) || null,
        value: x.id
      }
    })

    categoryItems.unshift({
      label: 'All Podcasts',
      onClick: () => this.queryPodcasts('categories', ''),
      parentValue: null,
      value: 'all podcasts'
    })

    const selectedCategoryArray = categoryItems.filter(x => x.value === queryCategoryId)
    let categorySelectNodes: any[] = []

    if (selectedCategoryArray.length > 0) {
      const selectedCategory = selectedCategoryArray[0]
      const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)
      
      let subcategoryItems: any[] = []
      if (selectedCategory.parentValue) {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.parentValue)
      } else {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.value)
      }

      subcategoryItems.unshift({
        label: 'All',
        onClick: () => this.queryPodcasts('categories', selectedCategory.parentValue),
        parentValue: null,
        value: selectedCategory.parentValue
      })

      // If it is a top-level category with sub-categories
      if (selectedCategory.hasSubcategories) {
        categorySelectNodes.push(
          <MediaListSelect
            items={topLevelCategoryItems}
            key='category-select-1'
            selected={selectedCategory.value} />
        )
        categorySelectNodes.push(
          <MediaListSelect
            items={subcategoryItems}
            key='category-select-2' />
        )
      }
      // Else if it is a sub-category
      else if (selectedCategory.parentValue) {
        categorySelectNodes.push(
          <MediaListSelect
            items={categoryItems}
            key='category-select-1'
            selected={selectedCategory.parentValue} />
        )

        categorySelectNodes.push(
          <MediaListSelect
            items={subcategoryItems}
            key='category-select-2'
            selected={selectedCategory.value} />
        )
      }
      // Else it is a top-level category without sub-categories
      else {
        categorySelectNodes.push(
          <MediaListSelect
            items={topLevelCategoryItems}
            key='category-select-1'
            selected={selectedCategory.value} />
        )
      }
    } else {
      const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)

      categorySelectNodes.push(
        <MediaListSelect
          items={topLevelCategoryItems}
          key='category-select-1' />
      )
    }

    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    const listItemNodes = listItems.map(x => {
      return (
        <MediaListItem
          dataPodcast={x}
          hasLink={true}
          itemType='podcast'
          key={`podcast-list-item-${uuidv4()}`} />
      )
    })

    return (
      <React.Fragment>
        <div className='media-list adjust-top-position'>
          <div className='media-list__selects'>
            <div className='media-list-selects__left'>
              {categorySelectNodes}
            </div>
            <div className='media-list-selects__right'>
              <MediaListSelect
                className='align-right'
                items={this.getQuerySortOptions()}
                selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
            </div>
          </div>
          {
            listItemsLoading &&
            <div className='media-list__loading'>
              <FontAwesomeIcon
                icon='spinner'
                spin />
            </div>
          }
          {
            !listItemsLoading && listItemNodes && listItemNodes.length > 0 &&
            <React.Fragment>
              {listItemNodes}
              <div className='media-list__load-more'>
                {
                  listItemsEndReached ?
                    <p>End of results</p>
                    : <Button
                      className='media-list-load-more__button'
                      isLoading={listItemsLoadingNextPage}
                      onClick={() => this.queryPodcasts('', '', queryPage + 1)}
                      text='Load More' />
                }
              </div>
            </React.Fragment>
          }
          {
            (!listItemsEndReached && listItemNodes.length === 0) &&
            <div>No results found</div>
          }
        </div>
      </React.Fragment>
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageListItemsLoading: bindActionCreators(currentPageListItemsLoading, dispatch),
  currentPageListItemsLoadingNextPage: bindActionCreators(currentPageListItemsLoadingNextPage, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Podcasts)
