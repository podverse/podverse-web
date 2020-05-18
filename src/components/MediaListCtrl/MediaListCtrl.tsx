
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'
import { Button, MediaListSelect, Pagination, setNowPlayingItemInStorage
  } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import config from '~/config'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { addOrUpdateHistoryItemPlaybackPosition, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  clone, cookieSetQuery } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading,
  playerQueueAddSecondaryItems, playerQueueLoadPriorityItems,
  playerQueueLoadSecondaryItems, userSetInfo } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery } from '~/services'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
const uuidv4 = require('uuid/v4')
const { QUERY_MEDIA_REFS_LIMIT } = config()

const debouncedEpisodeFilterQuery = AwesomeDebouncePromise(getEpisodesByQuery, 750)
const debouncedMediaRefFilterQuery = AwesomeDebouncePromise(getMediaRefsByQuery, 750)

type Props = {
  adjustTopPosition?: boolean
  allCategories?: any
  currentId?: string
  episode?: any
  episodeId?: string
  handleSetPageQueryState: Function
  includeOldest?: boolean
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  pageIsLoading?: any
  pageKey: string
  page?: any
  pages?: any
  playerQueueAddSecondaryItems?: any
  playerQueueLoadSecondaryItems?: any
  podcast?: any
  podcastId?: string
  queryFrom?: string
  queryPage: number
  querySort?: string
  queryType?: string
  settings?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaListCtrl extends Component<Props, State> {

  static defaultProps: Props = {
    handleSetPageQueryState: () => {},
    pageKey: 'default',
    queryPage: 1
  }

  queryListItems = async (queryType, queryFrom, querySort, page, categoryId) => {
    const { allCategories, episode, episodeId, handleSetPageQueryState, pageIsLoading, pageKey, pages,
      playerQueueLoadSecondaryItems, podcast, podcastId, user } = this.props
    const { subscribedPodcastIds } = user
    const { filterIsShowing, filterText } = pages[pageKey]

    this.setTemporaryMinHeightOnMediaList()

    const query: any = {
      page,
      from: queryFrom,
      sort: querySort,
      episodeId: queryFrom === 'from-episode' ? episodeId : null,
      podcastId: queryFrom === 'from-podcast' ? podcastId : null,
      categories: categoryId || allCategories[2].id /* Arts */,
      ...(filterIsShowing ? { searchAllFieldsText: filterText } : {}),
      ...(queryFrom === 'all-podcasts' ||
          queryFrom === 'subscribed-only' ? { includePodcast: true } : {}),
      ...(queryFrom === 'from-podcast' ? { includeEpisode: true } : {})
    }

    cookieSetQuery(pageKey, queryFrom, queryType, querySort, categoryId)

    const newState: any = {
      pageKey,
      queryPage: page,
      queryType,
      queryFrom,
      querySort,
      categoryId,
      selected: queryFrom
    }
    pageIsLoading(true)

    handleSetPageQueryState({
      pageKey,
      queryType,
      queryFrom,
      querySort,
      ...(page <= 1 ? { listItems: []} : {}),
      categoryId,
      selected: queryFrom
    })

    if (queryFrom === 'from-podcast') {
      query.podcastId = podcastId
    } else if (queryFrom === 'subscribed-only') {
      if (subscribedPodcastIds && subscribedPodcastIds.length > 0) {
        query.podcastId = subscribedPodcastIds
      } else {
        handleSetPageQueryState({
          ...newState,
          listItems: [],
          listItemsTotal: 0
        })
        pageIsLoading(false)
        return
      }
    }

    try {
      let nowPlayingItems = []
      let listItemsTotal

      if (queryType === 'episodes') {
        const response = await getEpisodesByQuery(query)
        const episodes = response.data
        listItemsTotal = episodes[1]
        nowPlayingItems = episodes[0].map(x => convertToNowPlayingItem(x, episode, podcast))
      } else {
        const response = await getMediaRefsByQuery(query)
        const mediaRefs = response.data
        listItemsTotal = mediaRefs[1]
        nowPlayingItems = mediaRefs[0].map(x => convertToNowPlayingItem(x, episode, podcast))
      }

      playerQueueLoadSecondaryItems(clone(nowPlayingItems))

      handleSetPageQueryState({
        ...newState,
        listItems: nowPlayingItems,
        listItemsTotal
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

    this.clearTemporaryMinHeightOnMediaList()
  }

  querySort = async selectedValue => {
    const { pageKey, pages } = this.props
    const { categoryId, queryFrom, queryType } = pages[pageKey]
        
    await this.queryListItems(queryType, queryFrom, selectedValue, 1, categoryId)
  }

  setTemporaryMinHeightOnMediaList = () => {
    const mediaListEl = document.querySelector('.media-list') as any
    if (mediaListEl && mediaListEl.clientHeight > 0) {
      mediaListEl.style.minHeight = `${mediaListEl.clientHeight}px`
    }
  }

  clearTemporaryMinHeightOnMediaList = () => {
    const mediaListEl = document.querySelector('.media-list') as any
    if (mediaListEl) {
      mediaListEl.style.minHeight = 'unset'
    }
  }

  getQueryTypeOptions = () => {
    const { pageKey, pages, podcastId, user } = this.props
    const { categoryId, queryFrom } = pages[pageKey]

    return [
      {
        label: 'Clips',
        onClick: () => this.queryListItems('clips', queryFrom, 'top-past-week', 1, categoryId),
        value: 'clips',
      },
      {
        label: 'Episodes',
        onClick: () => this.queryListItems(
          'episodes',
          podcastId ? 'from-podcast' : queryFrom,
          (user && user.id && !podcastId) ? 'most-recent' : 'top-past-week',
          1,
          categoryId
        ),
        value: 'episodes',
      }
    ]
  }

  getQueryFromOptions = (showFromPodcast, showFromEpisode) => {
    const { pageKey, pages } = this.props
    const { querySort, queryType } = pages[pageKey]

    const options = [] as any

    if (showFromPodcast) {
      options.unshift(
        {
          label: 'From this podcast',
          onClick: () => this.queryListItems(queryType, 'from-podcast', querySort, 1, null),
          value: 'from-podcast'
        }
      )
    }

    if (showFromEpisode) {
      options.unshift(
        {
          label: 'From this episode',
          onClick: () => this.queryListItems(queryType, 'from-episode', querySort, 1, null),
          value: 'from-episode'
        }
      )
    }

    return options
  }

  getQuerySortOptions(includeOldest?: boolean, showChronological?: boolean) {

    const items = [
      {
        label: 'most recent',
        onClick: () => this.querySort('most-recent'),
        value: 'most-recent'
      },
      {
        label: 'top - past day',
        onClick: () => this.querySort('top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.querySort('top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.querySort('top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.querySort('top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.querySort('top-all-time'),
        value: 'top-all-time'
      },
      {
        label: 'random',
        onClick: () => this.querySort('random'),
        value: 'random'
      }
    ]

    if (showChronological) {
      items.unshift({
        label: 'chronological',
        onClick: () => this.querySort('chronological'),
        value: 'chronological'
      })
    }

    if (includeOldest) {
      items.splice(1, 0, {
        label: 'oldest',
        onClick: () => this.querySort('oldest'),
        value: 'oldest'
      })
    }

    return items
  }

  playItem = async nowPlayingItem => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      pageKey, pages, playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { listItems, podcast } = pages[pageKey]
    const { nowPlayingItem: previousItem } = mediaPlayer
    
    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user, currentTime)
    }

    // If loading a new episode, clear the player to prevent the error:
    // TypeError: Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.
    // I don't know why this is happening because everywhere I am setting player.seekTo
    // the value should be wrapped in a Math.floor().
    // I also don't understand why this issue happens only for new episodes, but not new clips :(
    if (nowPlayingItem 
        && previousItem 
        && !nowPlayingItem.clipStartTime
        && nowPlayingItem.episodeId !== previousItem.episodeId) {
      window.player = null
    }

    // If podcast data is not a part of the nowPlayingItem, then user must be
    // using the 'From this podcast' filter on the podcast, episode, or clip page,
    // and we will need to enrich the nowPlayingItem with the podcast data.
    if (!nowPlayingItem.podcastId && podcast) {
      nowPlayingItem.podcastId = podcast.id
      nowPlayingItem.podcastImageUrl = podcast.imageUrl
      nowPlayingItem.podcastTitle = podcast.title
    }

    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    setNowPlayingItemInStorage(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    let nowPlayingItemIndex = -1
    if (nowPlayingItem.clipId) {
      nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    } else if (nowPlayingItem.episodeId) {
      nowPlayingItemIndex = listItems.map((x) => x.episodeId).indexOf(nowPlayingItem && nowPlayingItem.episodeId)
    }
    const queuedListItems = clone(listItems)
    if (nowPlayingItemIndex > -1) queuedListItems.splice(0, nowPlayingItemIndex + 1)
    playerQueueLoadSecondaryItems(queuedListItems)

    if (user && user.id) {
      await addOrUpdateHistoryItemPlaybackPosition(nowPlayingItem, user)

      const historyItems = user.historyItems.filter(x => {
        if (x) {
          if ((x.clipStartTime || x.clipEndTime) && x.clipId !== nowPlayingItem.clipId) {
            return x
          } else if (x.episodeId !== nowPlayingItem.episodeId) {
            return x
          }
        }
        return null
      })

      historyItems.push(nowPlayingItem)

      userSetInfo({ historyItems })
    }
  }

  toggleFilter = async () => {
    const { handleSetPageQueryState, pageKey, pages } = this.props
    const { categoryId, filterIsShowing, queryFrom, querySort, queryType } = pages[pageKey]
    
    handleSetPageQueryState({
      pageKey,
      filterIsShowing: !filterIsShowing,
      ...(filterIsShowing ? { filterText: '' } : {})
    })

    if (filterIsShowing) {
      await this.queryListItems(queryType, queryFrom, querySort, 1, categoryId)
    }
  }

  handleFilterTextChange = async event => {
    const { episodeId, handleSetPageQueryState, pageIsLoading, pageKey, pages, podcastId,
      user } = this.props
    const { queryFrom, querySort, queryType } = pages[pageKey]
    const { subscribedPodcastIds } = user
    const text = event.target.value

    pageIsLoading(true)

    handleSetPageQueryState({
      pageKey,
      filterText: text
    })

    let pId
    if (queryFrom === 'from-podcast') {
      pId = podcastId
    } else if (queryFrom === 'subscribed-only') {
      pId = subscribedPodcastIds && subscribedPodcastIds.length > 0 ? subscribedPodcastIds : ['no-results']
    }

    const query: any = {
      page: 1,
      from: queryFrom,
      sort: querySort,
      episodeId: queryFrom === 'from-episode' ? episodeId : null,
      podcastId: pId || null,
      searchAllFieldsText: text,
      includePodcast: !!text || queryFrom === 'subscribed-only' || queryFrom === 'all-podcasts'
    }

    try {
      let nowPlayingItems
      let listItemsTotal

      if (queryType === 'episodes') {
        const response = await debouncedEpisodeFilterQuery(query)
        const episodes = response.data
        nowPlayingItems = episodes[0].map(x => convertToNowPlayingItem(x))
        listItemsTotal = episodes[1]
      } else {
        const response = await debouncedMediaRefFilterQuery(query)
        const mediaRefs = response.data
        nowPlayingItems = mediaRefs[0].map(x => convertToNowPlayingItem(x))
        listItemsTotal = mediaRefs[1]
      }
      
      playerQueueLoadSecondaryItems(clone(nowPlayingItems))

      handleSetPageQueryState({
        pageKey,
        listItems: nowPlayingItems,
        listItemsTotal
      })
    } catch (error) {
      console.log(error)
      handleSetPageQueryState({
        pageKey,
        listItems: [],
        listItemsTotal: 0
      })
    }

    pageIsLoading(false)
  }

  clearFilterText = async () => {
    this.handleFilterTextChange({
      target: {
        value: ''
      }
    })
  }

  generateTopLevelSelectNodes = () => {
    const { pageKey, pages } = this.props
    const { queryFrom, queryType, querySort } = pages[pageKey]
    const topLevelItems = [] as any[]

    topLevelItems.push({
      label: 'Subscribed',
      onClick: () => this.queryListItems(queryType, 'subscribed-only', querySort, 1, null),
      parentValue: null,
      value: 'subscribed-only'
    })

    topLevelItems.push({
      label: 'All Podcasts',
      onClick: () => this.queryListItems(queryType, 'all-podcasts', querySort, 1, null),
      parentValue: null,
      value: 'all-podcasts'
    })

    topLevelItems.push({
      label: 'Categories',
      onClick: () => this.queryListItems(queryType, 'from-category', querySort, 1, null),
      parentValue: null,
      value: 'from-category'
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
    const { queryType, queryFrom, querySort, selected } = pages[pageKey]

    const categoryItems = allCategories.map(x => {
      return {
        hasSubcategories: x.categories && x.categories.length > 0,
        label: x.title,
        onClick: () => this.queryListItems(queryType, 'from-category', querySort, 1, x.id),
        parentValue: (x.category && x.category.id) || null,
        value: x.id
      }
    })

    const categorySelectNodes: any[] = []
    const selectedCategory = categoryItems.find(x => x.value === selectedCategoryId) || categoryItems[2] // Arts category

    if (selectedCategory) {
      const topLevelCategoryItems = categoryItems.filter(x => x.parentValue === null)

      let subcategoryItems: any[] = []
      if (selectedCategory.parentValue) {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.parentValue)
      } else {
        subcategoryItems = categoryItems.filter(x => x.parentValue === selectedCategory.value)
      }

      subcategoryItems.unshift({
        label: 'All',
        onClick: () => this.queryListItems(queryType, queryFrom, querySort, 1, selectedCategory.parentValue),
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
            className='align-right-2'
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
            className='align-right-2'
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

  handleQueryPage = async page => {
    const { pageIsLoading, pageKey, pages } = this.props
    const { categoryId, queryFrom, querySort, queryType } = pages[pageKey]
    pageIsLoading(true)

    await this.queryListItems(
      queryType,
      queryFrom,
      querySort,
      page,
      categoryId
    )
    
    pageIsLoading(false)

    const mediaListSelectsEl = document.querySelector('.media-list__selects')
    if (mediaListSelectsEl) {
      mediaListSelectsEl.scrollIntoView()
    }
  }

  render() {
    const { adjustTopPosition, episodeId, includeOldest, mediaPlayer, page, pageKey, pages,
      podcastId, settings } = this.props
    const { isLoading } = page
    const { filterButtonHide } = settings
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { categoryId, filterIsShowing, filterText, listItems, listItemsTotal, queryFrom,
      queryPage, querySort, queryType } = pages[pageKey]

    let mediaListItemType = 'now-playing-item'
    if (queryType === 'episodes') {
      if (queryFrom === 'from-podcast') {
        mediaListItemType = 'now-playing-item-episode-from-podcast'
      } else if (queryFrom === 'all-podcasts') {
        mediaListItemType = 'now-playing-item-episode-from-all-podcasts'
      }
    } else {
      if (queryFrom === 'from-episode') {
        mediaListItemType = 'now-playing-item-clip-from-episode'
      } else if (queryFrom === 'from-podcast') {
        mediaListItemType = 'now-playing-item-clip-from-podcast'
      }
    }

    const listItemNodes = listItems.map(x => {
      const isActive = () => {
        if (mpNowPlayingItem) {
          if (x.clipId) {
            return x.clipId === mpNowPlayingItem.clipId
          } else if (x.episodeId) {
            return x.episodeId === mpNowPlayingItem.episodeId
          }
        }

        return false
      }

      return (
        <MediaListItemCtrl
          handlePlayItem={this.playItem}
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType={mediaListItemType}
          nowPlayingItem={x}
          pageKey={pageKey}
          showMoreMenu={true} />
      )
    })

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQueryFromOption = this.getQueryFromOptions(
      !!podcastId, !!episodeId && queryType === 'clips').filter(x => x.value === queryFrom)
    const sortOptions = this.getQuerySortOptions(includeOldest, !!episodeId && queryType === 'clips' && queryFrom === 'from-episode')
    const selectedQuerySortOption = sortOptions.filter(x => x.value === querySort)

    let bottomSelectNodes = []
    if (!podcastId && !episodeId) {
      bottomSelectNodes = this.generateCategorySelectNodes(categoryId) as any
    } else if (podcastId || episodeId) {
      bottomSelectNodes = [
        <MediaListSelect
          items={this.getQueryFromOptions(!!podcastId, !!episodeId && queryType === 'clips')}
          selected={selectedQueryFromOption.length > 0 ? selectedQueryFromOption[0].value : null} />
      ] as any
    }

    const noResultsFoundMsg = `No ${queryType === 'episodes' ? 'episodes' : 'clips'} found`

    return (      
      <div className={`media-list ${adjustTopPosition ? 'adjust-top-position' : ''}`}>
        <div className='media-list__selects'>
          <div className='media-list-selects__left'>
            <MediaListSelect
              items={this.getQueryTypeOptions()}
              selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
            {this.generateTopLevelSelectNodes()}
          </div>
          <div className='media-list-selects__right'>
            <div className='media-list-selects__spacer' />
            <MediaListSelect
              className='align-right'
              items={sortOptions}
              selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
          </div>
        </div>
        <div className='media-list__selects'>
          <div className='media-list-selects__left-and-right'>
            {queryFrom === 'from-category' && bottomSelectNodes}
          </div>
        </div>
        {
          filterButtonHide !== 'true' &&
            <div className='media-list__filter'>
              <InputGroup>
                <InputGroupAddon
                  addonType='prepend'
                  className='media-list-filter__filter-icon'>
                  <Button
                    className={filterIsShowing ? '' : 'not-showing'}
                    onClick={this.toggleFilter}>
                    <FontAwesomeIcon icon='filter' /> filter
                  </Button>
                </InputGroupAddon>
                {
                  filterIsShowing &&
                  <Fragment>
                    <Input
                      onChange={this.handleFilterTextChange}
                      value={filterText || ''} />
                    <InputGroupAddon
                      addonType='append'
                      className='media-list-filter__clear-icon'>
                      <Button onClick={this.clearFilterText}>
                        <FontAwesomeIcon icon='times' />
                      </Button>
                    </InputGroupAddon>
                  </Fragment>  
                }
              </InputGroup>
            </div>
        }
        <Fragment>
          {
            listItemNodes && listItemNodes.length > 0 &&
              <Fragment>
                {listItemNodes}
                <Pagination
                  currentPage={queryPage || 1}
                  handleQueryPage={this.handleQueryPage}
                  pageRange={2}
                  totalPages={Math.ceil(listItemsTotal / QUERY_MEDIA_REFS_LIMIT)} />
              </Fragment>
          }
          {
            (!isLoading && queryPage === 1 && listItemNodes && listItemNodes.length === 0) &&
              <div className='no-results-msg'>{noResultsFoundMsg}</div>
          }
        </Fragment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  playerQueueAddSecondaryItems: bindActionCreators(playerQueueAddSecondaryItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaListCtrl)
