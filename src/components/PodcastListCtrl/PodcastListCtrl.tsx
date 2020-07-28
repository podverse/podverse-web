import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem, MediaListSelect, Pagination } from 'podverse-ui'
import config from '~/config'
import PV from '~/lib/constants'
import { cookieSetQuery, getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPodcastsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')
const { QUERY_PODCASTS_LIMIT } = config()

type Props = {
  allCategories?: any
  handleSetPageQueryState: Function
  page?: any
  pageIsLoading?: any
  pageKey: string
  pages?: any
  pagesSetQueryState?: any
  settings?: any
  user?: any
}

type State = {}

class PodcastListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => {},
    pageKey: 'default'
  }

  queryPodcasts = async (query, newState) => {
    const { handleSetPageQueryState, pageIsLoading, pageKey, pages } = this.props
    const { queryPage: prevPage } = pages[pageKey]

    cookieSetQuery(pageKey, query.from, query.type, query.sort, query.categories)

    pageIsLoading(true)

    handleSetPageQueryState({
      ...newState,
      queryPage: prevPage // wait before updating queryPage
    })

    try {
      const response = await getPodcastsByQuery(query)
      const podcasts = response.data || []

      handleSetPageQueryState({
        ...newState,
        listItems: podcasts[0],
        listItemsTotal: podcasts[1]
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        ...newState,
        listItems: [],
        listItemsTotal: 0
      })
    }

    pageIsLoading(false)
  }

  queryPodcastsAll = async () => {
    const { pageKey, pages } = this.props
    const { querySort } = pages[pageKey]

    const query: any = {
      page: 1,
      from: PV.query.all_podcasts,
      sort: querySort
    }

    const newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom: PV.query.all_podcasts,
      selected: PV.query.all_podcasts,
    }

    await this.queryPodcasts(query, newState)
  }

  queryPodcastsCategory = async categoryId => {
    const { pageKey, pages } = this.props
    const { querySort } = pages[pageKey]

    const query: any = {
      page: 1,
      from: PV.query.from_category,
      sort: querySort,
      categories: categoryId
    }

    const newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom: PV.query.from_category,
      categoryId,
      selected: categoryId
    }

    await this.queryPodcasts(query, newState)
  }

  queryPodcastsSubscribed = async () => {
    const { handleSetPageQueryState, pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { querySort } = pages[pageKey]

    const query: any = {
      page: 1,
      from: PV.query.subscribed_only,
      sort: querySort,
      subscribedPodcastIds: subscribedPodcastIds || []
    }

    const newState: any = {
      pageKey,
      queryFrom: PV.query.subscribed_only,
      queryPage: 1,
      selected: PV.query.subscribed_only,
    }

    if (subscribedPodcastIds && subscribedPodcastIds.length < 1) {
      handleSetPageQueryState({
        ...newState,
        listItems: [],
        listItemsTotal: 0
      })
      return
    } else {
      handleSetPageQueryState(newState)
    }

    await this.queryPodcasts(query, newState)
  }
  
  queryPodcastsSort = async selectedValue => {
    const { pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { categoryId, queryFrom } = pages[pageKey]

    const query: any = {
      page: 1,
      from: queryFrom,
      sort: selectedValue,
      categories: queryFrom === PV.query.from_category ? categoryId : null,
      subscribedPodcastIds: queryFrom === PV.query.subscribed_only ? subscribedPodcastIds : null
    }

    const newState: any = {
      pageKey,
      queryPage: 1,
      queryFrom,
      querySort: selectedValue
    }

    await this.queryPodcasts(query, newState)
  }

  queryPodcastsLoadPage = async page => {
    const { pageKey, pages, user } = this.props
    const { subscribedPodcastIds } = user
    const { categoryId, queryFrom, querySort } = pages[pageKey]

    const query: any = {
      page,
      from: queryFrom,
      sort: querySort,
      categories: queryFrom === PV.query.from_category ? categoryId : null,
      subscribedPodcastIds: queryFrom === PV.query.subscribed_only ? subscribedPodcastIds : null
    }

    const newState: any = {
      pageKey,
      queryPage: page,
      queryFrom,
      querySort
    }

    await this.queryPodcasts(query, newState)
  }

  getQuerySortOptions() {
    return [
      {
        label: PV.query.label.alphabetical,
        onClick: () => this.queryPodcastsSort(PV.query.alphabetical),
        value: PV.query.alphabetical
      },
      {
        label: PV.query.label.most_recent,
        onClick: () => this.queryPodcastsSort(PV.query.most_recent),
        value: PV.query.most_recent
      },
      // {
      //   label: 'top - past hour',
      //   onClick: () => this.queryPodcastsSort('top-past-hour'),
      //   value: 'top-past-hour'
      // },
      {
        label: PV.query.label.top_past_day,
        onClick: () => this.queryPodcastsSort(PV.query.top_past_day),
        value: PV.query.top_past_day
      },
      {
        label: PV.query.label.top_past_week,
        onClick: () => this.queryPodcastsSort(PV.query.top_past_week),
        value: PV.query.top_past_week
      },
      {
        label: PV.query.label.top_past_month,
        onClick: () => this.queryPodcastsSort(PV.query.top_past_month),
        value: PV.query.top_past_month
      },
      {
        label: PV.query.label.top_past_year,
        onClick: () => this.queryPodcastsSort(PV.query.top_past_year),
        value: PV.query.top_past_year
      },
      {
        label: PV.query.label.top_all_time,
        onClick: () => this.queryPodcastsSort(PV.query.top_all_time),
        value: PV.query.top_all_time
      },
      {
        label: PV.query.label.random,
        onClick: () => this.queryPodcastsSort(PV.query.random),
        value: PV.query.random
      }
    ]
  }

  generateTopLevelSelectNodes = () => {
    const { allCategories, pageKey, pages } = this.props
    const { categoryId, queryFrom } = pages[pageKey]
    const topLevelItems = [] as any[]

    topLevelItems.push({
      label: PV.query.label.Subscribed,
      onClick: () => this.queryPodcastsSubscribed(),
      parentValue: null,
      value: PV.query.subscribed_only
    })

    topLevelItems.push({
      label: PV.query.label.AllPodcasts,
      onClick: () => this.queryPodcastsAll(),
      parentValue: null,
      value: PV.query.all_podcasts
    })

    topLevelItems.push({
      label: PV.query.label.Categories,
      onClick: () => this.queryPodcastsCategory(categoryId || allCategories[2].id /* Arts */),
      parentValue: null,
      value: PV.query.from_category
    })

    return (
      <MediaListSelect
        items={topLevelItems}
        key='top-level-select'
        selected={queryFrom} />
    )
  }

  generateCategorySelectNodes = (selectedCategoryId) => {
    const { allCategories, pageKey, pages } = this.props
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

    const categorySelectNodes: any[] = []
    const selectedCategory = categoryItems.find(x => x.value === selectedCategoryId) || categoryItems[3] // Arts category

    if (selectedCategory) {
      const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)

      let subcategoryItems: any[] = []
      if (selectedCategory.parentValue) {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.parentValue)
      } else {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.value)
      }

      subcategoryItems.unshift({
        label: PV.query.label.All,
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

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  handleQueryPage = async page => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    await this.queryPodcastsLoadPage(page)
    pageIsLoading(false)

    const mediaListSelectsEl = document.querySelector('.media-list__selects')
    if (mediaListSelectsEl) {
      mediaListSelectsEl.scrollIntoView()
    }
  }

  render() {
    const { page, pageKey, pages, user } = this.props
    const { isLoading } = page
    const { categoryId, listItems, listItemsTotal, queryFrom, queryPage, querySort } = pages[pageKey]

    const listItemNodes = listItems.map(x => {
      return (
        <MediaListItem
          dataPodcast={x}
          handleLinkClick={this.linkClick}
          hasLink={true}
          itemType={PV.attributes.mediaListItem.itemType.podcast}
          key={`podcast-list-item-${uuidv4()}`} />
      )
    })

    const bottomSelectNodes = this.generateCategorySelectNodes(categoryId)

    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)
    const isNotLoggedIn = !user || !user.id
    const noResultsFoundMsg = isNotLoggedIn ? PV.errors.login.ViewYourSubscriptions : PV.mediaList.noResultMsg.noPodcastsFound

    return (
      <div className={'media-list adjust-top-position'}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            {this.generateTopLevelSelectNodes()}
          </div>
          <div className='media-list-selects__right'>
            <MediaListSelect
              className='align-right'
              items={this.getQuerySortOptions()}
              selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
          </div>
        </div>
        <div className='media-list__selects'>
          <div className='media-list-selects__inline'>
            {queryFrom === PV.query.from_category && bottomSelectNodes}
          </div>
        </div>
        <Fragment>
          {
            listItemNodes && listItemNodes.length > 0 &&
              <Fragment>
                {listItemNodes}
                <Pagination
                  currentPage={queryPage || 1}
                  handleQueryPage={this.handleQueryPage}
                  pageRange={2}
                  totalPages={Math.ceil(listItemsTotal / QUERY_PODCASTS_LIMIT)}/>
              </Fragment>
          }
          {
            (!isLoading && queryPage === 1 && listItemNodes.length === 0) &&
              <div className='no-results-msg'>
                {noResultsFoundMsg}
              </div>
          }
        </Fragment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PodcastListCtrl)
