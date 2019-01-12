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
  }

  async queryPodcasts(selectedKey = '', selectedValue = '', page = 1) {
    const { handleSetPageQueryState, pageKey, pages, settings, user } = this.props
    const { nsfwMode } = settings
    const { subscribedPodcastIds } = user
    const { categoryId, listItems, queryFrom, querySort } = pages[pageKey]

    let query: any = {
      ...!!categoryId && { categories: categoryId },
      ...!!queryFrom && { from: queryFrom },
      page,
      ...!!querySort && { sort: querySort }
    }

    handleSetPageQueryState({
      pageKey,
      isLoadingMore: true
    })

    let newState: any = {
      pageKey,
      queryPage: page,
      ...selectedKey !== 'sort' && { selected: selectedKey },
    }

    if (selectedKey === 'sort') {
      newState.querySort = selectedValue
      query.sort = selectedValue
      query.subscribedPodcastIds = subscribedPodcastIds
    } else if (selectedKey === 'categories') {
      newState.queryFrom = 'from-category'
      newState.categoryId = selectedValue
      query.from = 'from-category'
      query.categories = selectedValue
    } else if (selectedKey === 'subscribed-only') {
      newState.queryFrom = 'subscribed-only'
      newState.categoryId = null
      query.from = 'subscribed-only'
      query.subscribedPodcastIds = subscribedPodcastIds
      delete query.categories
    } else if (selectedKey === 'all-podcasts') {
      newState.queryFrom = 'all-podcasts'
      newState.categoryId = null
      query.from = 'all-podcasts'
      delete query.categories
      delete query.subscribedPodcastIds
    }

    if (['sort', 'categories', 'subscribed-only', 'all-podcasts'].includes(selectedKey)) {
      newState.isLoadingInitial = true
    }

    handleSetPageQueryState(newState)

    let combinedListItems: any = []

    if (page > 1) {
      combinedListItems = listItems
    }

    try {
      const response = await getPodcastsByQuery(query, nsfwMode)
      const podcasts = response.data || []
      combinedListItems = combinedListItems.concat(podcasts)

      handleSetPageQueryState({
        pageKey,
        endReached: podcasts.length < 2,
        isLoadingInitial: false,
        isLoadingMore: false,
        listItems: page > 1 ? combinedListItems : podcasts
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        pageKey,
        isLoadingInitial: false,
        isLoadingMore: false
      })
    }
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

  generateCategorySelectNodes (allCategories, categoryId, user) {
    const { pageKey, pages } = this.props
    const { selected } = pages[pageKey]
    const categoryItems = allCategories.map(x => {
      return {
        hasSubcategories: x.categories && x.categories.length > 0,
        label: x.title,
        onClick: () => this.queryPodcasts('categories', x.id),
        parentValue: (x.category && x.category.id) || null,
        value: x.id
      }
    })

    if (user && user.id) {
      categoryItems.unshift({
        label: 'Subscribed Only',
        onClick: () => this.queryPodcasts('subscribed-only', ''),
        parentValue: null,
        value: 'subscribed-only'
      })
    }

    categoryItems.unshift({
      label: 'All Podcasts',
      onClick: () => this.queryPodcasts('all-podcasts', ''),
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
                          isLoading={isLoadingMore}
                          onClick={() => this.queryPodcasts('', '', queryPage + 1)}
                          text='Load More' />
                    }
                  </div>
                </Fragment>
              }
              {
                (!endReached && listItemNodes.length === 0) &&
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
