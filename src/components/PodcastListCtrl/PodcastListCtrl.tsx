import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem, MediaListSelect, PVButton as Button } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageIsLoading } from '~/redux/actions'
import { getPodcastsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  allCategories?: any
  categoryId?: string
  handleSetPageQueryState: Function
  pageIsLoading?: any
  pageKey: string
  pages?: any
  queryFrom?: string
  queryPage?: number
  querySort?: string
  settings?: any
  user?: any
}

type State = {}

class PodcastListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => {},
    pageKey: 'default'
  }

  constructor(props) {
    super(props)

    this.generateCategorySelectNodes = this.generateCategorySelectNodes.bind(this)
    this.linkClick = this.linkClick.bind(this)
    this.queryPodcasts = this.queryPodcasts.bind(this)
    this.queryLoadInitial = this.queryLoadInitial.bind(this)
    this.queryPodcastsAll = this.queryPodcastsAll.bind(this)
    this.queryPodcastsCategory = this.queryPodcastsCategory.bind(this)
    this.queryPodcastsSubscribed = this.queryPodcastsSubscribed.bind(this)
    this.queryPodcastsSort = this.queryPodcastsSort.bind(this)
    this.queryPodcastsLoadMore = this.queryPodcastsLoadMore.bind(this)
  }

  async queryPodcasts(query, newState, isLoadMore = false) {
    const { handleSetPageQueryState, pageKey, pages, settings } = this.props
    const { nsfwMode } = settings
    const { listItems } = pages[pageKey]

    let combinedListItems = []
    if (isLoadMore) {
      combinedListItems = listItems
    }

    try {
      const response = await getPodcastsByQuery(query, nsfwMode)
      const podcasts = response.data || []
      combinedListItems = combinedListItems.concat(podcasts)

      handleSetPageQueryState({
        ...newState,
        endReached: podcasts.length < 2,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: combinedListItems
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        ...newState,
        endReached: false,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: []
      })
    }
  }

  queryLoadInitial() {
    const { categoryId, handleSetPageQueryState, pageKey } = this.props

    handleSetPageQueryState({
      pageKey,
      isLoadingInitial: true
    })
  }

  async queryPodcastsAll() {
    const { pageKey, pages } = this.props
    const { querySort } = pages[pageKey]

    this.queryLoadInitial()

    let query: any = {
      page: 1,
      from: 'all-podcasts',
      sort: querySort
    }

    let newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom: 'all-podcasts',
      selected: 'all-podcasts',
    }

    await this.queryPodcasts(query, newState)
  }

  async queryPodcastsCategory(categoryId) {
    const { pageKey, pages } = this.props
    const { querySort } = pages[pageKey]

    this.queryLoadInitial()

    let query: any = {
      page: 1,
      from: 'from-category',
      sort: querySort,
      categories: categoryId
    }

    let newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom: 'from-category',
      categoryId,
      selected: categoryId
    }

    await this.queryPodcasts(query, newState)
  }

  async queryPodcastsSubscribed() {
    const { pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { querySort } = pages[pageKey]

    this.queryLoadInitial()

    let query: any = {
      page: 1,
      from: 'subscribed-only',
      sort: querySort,
      subscribedPodcastIds
    }

    let newState: any = {
      pageKey,
      queryFrom: 'subscribed-only',
      queryPage: 1,
      selected: 'subscribed-only',
    }

    await this.queryPodcasts(query, newState)
  }
  
  async queryPodcastsSort(selectedValue) {
    const { pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { categoryId, queryFrom } = pages[pageKey]

    this.queryLoadInitial()

    let query: any = {
      page: 1,
      from: queryFrom,
      sort: selectedValue,
      categories: queryFrom === 'from-category' ? categoryId : null,
      subscribedPodcastIds: queryFrom === 'subscribed-only' ? subscribedPodcastIds : null
    }

    let newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom,
      querySort: selectedValue
    }

    await this.queryPodcasts(query, newState)
  }

  async queryPodcastsLoadMore() {
    const { handleSetPageQueryState, pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { categoryId, queryFrom, queryPage, querySort } = pages[pageKey]

    handleSetPageQueryState({
      pageKey,
      isLoadingMore: true
    })

    let query: any = {
      page: queryPage + 1,
      from: queryFrom,
      sort: querySort,
      categories: queryFrom === 'from-category' ? categoryId : null,
      subscribedPodcastIds: queryFrom === 'subscribed-only' ? subscribedPodcastIds : null
    }

    let newState: any = {
      pageKey,
      queryPage: queryPage + 1,
      queryFrom,
      querySort
    }

    await this.queryPodcasts(query, newState, true)
  }

  getQuerySortOptions() {
    return [
      {
        label: 'top - past hour',
        onClick: () => this.queryPodcastsSort('top-past-hour'),
        value: 'top-past-hour'
      },
      {
        label: 'top - past day',
        onClick: () => this.queryPodcastsSort('top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.queryPodcastsSort('top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.queryPodcastsSort('top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.queryPodcastsSort('top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.queryPodcastsSort('top-all-time'),
        value: 'top-all-time'
      },
      {
        label: 'most recent',
        onClick: () => this.queryPodcastsSort('most-recent'),
        value: 'most-recent'
      }
    ]
  }

  // BEWARE! X_X
  generateCategorySelectNodes (allCategories, categoryId, user) {
    const { pageKey, pages } = this.props
    const { selected } = pages[pageKey]
    const categoryItems = allCategories.map(x => {
      return {
        hasSubcategories: x.categories && x.categories.length > 0,
        label: x.title,
        onClick: () => this.queryPodcastsCategory(x.id),
        parentValue: (x.category && x.category.id) || null,
        value: x.id
      }
    })

    if (user && user.id) {
      categoryItems.unshift({
        label: 'Subscribed Only',
        onClick: () => this.queryPodcastsSubscribed(),
        parentValue: null,
        value: 'subscribed-only'
      })
    }

    categoryItems.unshift({
      label: 'All Podcasts',
      onClick: () => this.queryPodcastsAll(),
      parentValue: null,
      value: 'all-podcasts'
    })

    let selectedCategoryArray = [] as any[]
    if (selected === 'all-podcasts') {
      selectedCategoryArray = [categoryItems[0]]
    } else if (selected === 'subscribed-only') {
      selectedCategoryArray = [categoryItems[1]]
    } else if (categoryId) {
      selectedCategoryArray = categoryItems.filter(x => x.value === categoryId)
    }
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
        onClick: () => this.queryPodcastsCategory(selectedCategory.parentValue),
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
        const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)

        categorySelectNodes.push(
          <MediaListSelect
            items={topLevelCategoryItems}
            key='category-select-3'
            selected={selectedCategory.parentValue} />
        )

        categorySelectNodes.push(
          <MediaListSelect
            items={subcategoryItems}
            key='category-select-4'
            selected={selectedCategory.value} />
        )
      }
      // Else it is a top-level category without sub-categories
      else {
        categorySelectNodes.push(
          <MediaListSelect
            items={topLevelCategoryItems}
            key='category-select-5'
            selected={selectedCategory.value} />
        )
      }
    } else {
      const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)

      categorySelectNodes.push(
        <MediaListSelect
          items={topLevelCategoryItems}
          key='category-select-6'
          selected={selected} />
      )
    }

    return categorySelectNodes
  }

  linkClick() {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { allCategories, pageKey, pages, user } = this.props
    const { categoryId, endReached, isLoadingInitial, isLoadingMore, listItems,
      queryPage, querySort } = pages[pageKey]

    const listItemNodes = listItems.map(x => {
      return (
        <MediaListItem
          dataPodcast={x}
          handleLinkClick={this.linkClick}
          hasLink={true}
          itemType='podcast'
          key={`podcast-list-item-${uuidv4()}`} />
      )
    })

    const categorySelectNodes = this.generateCategorySelectNodes(allCategories, categoryId, user)

    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    return (
      <div className={'media-list adjust-top-position'}>
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
          isLoadingInitial &&
            <div className='media-list__loader'>
              <FontAwesomeIcon icon='spinner' spin />
            </div>
        }
        {
          !isLoadingInitial &&
            <Fragment>
              {
                listItemNodes && listItemNodes.length > 0 &&
                <Fragment>
                  {listItemNodes}
                  <div className='media-list__load-more'>
                    {
                      endReached ?
                        <p className='no-results-msg'>End of results</p>
                        : <Button
                          className='media-list-load-more__button'
                          disabled={isLoadingMore}
                          isLoading={isLoadingMore}
                          onClick={this.queryPodcastsLoadMore}
                          text='Load More' />
                    }
                  </div>
                </Fragment>
              }
              {
                (queryPage === 1 && listItemNodes.length === 0) &&
                <div className='no-results-msg'>No podcasts found</div>
              }
            </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PodcastListCtrl)
