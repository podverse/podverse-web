
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import { currentPageListItemsLoading, currentPageLoadNowPlayingItem,
  mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
  modalsAddToShow, modalsMakeClipShow, playerQueueLoadPriorityItems
  } from '~/redux/actions'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const uuidv4 = require('uuid/v4')

type Props = {
  currentPage?: any
  currentPageListItemsLoading?: any
  currentPageLoadNowPlayingItem?: any
  handleAddToQueue?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
  modalsMakeClipShow?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  queryFrom?: string
  querySort?: string
  queryType?: string
  user?: any
}

type State = {
  queryFrom?: string
  querySort?: string
  queryType?: string
}

interface MediaContentView {
  queryFromRef: any
  querySortRef: any
  queryTypeRef: any
}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    currentPage: {
      listItems: []
    },
    queryFrom: 'from-podcast',
    querySort: 'top-all-time',
    queryType: 'clips'
  }

  constructor (props) {
    super(props)

    this.state = {
      queryFrom: props.queryFrom,
      querySort: props.querySort,
      queryType: props.queryType
    }

    this.queryMediaListItems = this.queryMediaListItems.bind(this)
    this.getCurrentPageItem = this.getCurrentPageItem.bind(this)
  }

  anchorOnClick (event, data, itemType) {
    const { currentPageListItemsLoading, currentPageLoadNowPlayingItem } = this.props

    if (itemType === 'episode') {
      // newState.episode = data
    } else if (itemType === 'mediaRef') {
      // newState.mediaRef = data
    } else if (itemType === 'nowPlayingItem') {
      currentPageLoadNowPlayingItem(data)
    } else if (itemType === 'podcast') {
      // newState.podcast = data
    }

    currentPageListItemsLoading(true)
  }

  getCurrentPageItem = () => {
    const { currentPage } = this.props
    const { episode, mediaRef, nowPlayingItem } = currentPage

    if (episode) {
      return convertToNowPlayingItem(episode)
    } else if (mediaRef) {
      return convertToNowPlayingItem(mediaRef)
    } else if (nowPlayingItem) {
      return nowPlayingItem
    }
  }

  playItem(nowPlayingItem) {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying } = this.props
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)

    if (this.isCurrentlyPlayingItem()) {
      mediaPlayerUpdatePlaying(false)
    } else {
      mediaPlayerUpdatePlaying(true)
    }
  }

  addToQueue(nowPlayingItem, isLast) {
    const { currentPage, playerQueueLoadPriorityItems } = this.props
    const { episode, mediaRef } = currentPage

    if (nowPlayingItem && nowPlayingItem.episodeMediaUrl) {
      addItemToPriorityQueueStorage(nowPlayingItem, isLast)
    } else if (episode) {
      addItemToPriorityQueueStorage(convertToNowPlayingItem(episode))
    } else if (mediaRef) {
      addItemToPriorityQueueStorage(convertToNowPlayingItem(mediaRef))
    }

    const priorityItems = getPriorityQueueItemsStorage()
    playerQueueLoadPriorityItems(priorityItems)
  }

  toggleAddToModal = () => {
    const { modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo
    const currentPageItem = this.getCurrentPageItem()

    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem: currentPageItem,
      showQueue: true
    })
  }

  toggleMakeClipModal = () => {
    const { modals, modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { isOpen } = makeClip
    const currentPageItem = this.getCurrentPageItem()

    modalsMakeClipShow({
      isEditing: true,
      isOpen: !isOpen,
      nowPlayingItem: currentPageItem
    })
  }

  isCurrentlyPlayingItem() {
    const { currentPage, mediaPlayer } = this.props
    const { episode, mediaRef, nowPlayingItem } = currentPage
    const { nowPlayingItem: mpNowPlayingItem, playing } = mediaPlayer
    
    return (
      playing
      && ((episode && episode.mediaUrl === mpNowPlayingItem.episodeMediaUrl)
      || (mediaRef && mediaRef.id === mpNowPlayingItem.clipId)
      || ( // OR is a nowPlayingItem clip
        nowPlayingItem
        && nowPlayingItem.clipStartTime > 0
        && nowPlayingItem.clipId === mpNowPlayingItem.clipId
      )
      || ( // OR is a nowPlayingItem episode
        nowPlayingItem
        && !nowPlayingItem.clipStartTime
        && nowPlayingItem.episodeMediaUrl === mpNowPlayingItem.episodeMediaUrl
      ))
    )
  }

  getPageTypeAndId() {
    const { currentPage } = this.props
    const { episode, mediaRef, nowPlayingItem, podcast } = currentPage
    
    let pageId
    let pageType

    if (episode) {
      pageId = episode.id
      pageType = 'episode'
    } else if (mediaRef) {
      pageId = mediaRef.id
      pageType = 'clip'
    } else if (nowPlayingItem) {
      if (nowPlayingItem.clipStartTime >= 0) {
        pageId = nowPlayingItem.clipId
        pageType = 'clip'
      } else {
        pageId = nowPlayingItem.episodeId
        pageType = 'episode'
      }
    } else if (podcast) {
      pageId = podcast.id
      pageType = 'podcast'
    }

    return { pageType, pageId }
  }

  queryMediaListItems(selectedKey, selectedValue) {
    const { queryFrom, querySort, queryType } = this.state
    
    let query = {
      from: queryFrom,
      sort: querySort,
      type: queryType
    }

    if (selectedKey === 'type') {
      this.setState({ queryType: selectedValue })
      query.type = selectedValue
    } else if (selectedKey === 'from') {
      this.setState({ queryFrom: selectedValue })
      query.from = selectedValue
    } else if (selectedKey === 'sort') {
      this.setState({ querySort: selectedValue })
      query.sort = selectedValue
    }
    const {pageType, pageId} = this.getPageTypeAndId()
    const href = `/${pageType}?id=${pageId}&type=${query.type}&from=${query.from}&sort=${query.sort}`
    const as = `/${pageType}/${pageId}`
    Router.push(href, as)
  }

  getQueryTypeOptions() {
    return [
      {
        label: 'Clips',
        onClick: () => this.queryMediaListItems('type', 'clips'),
        value: 'clips',
      },
      {
        label: 'Episodes',
        onClick: () => this.queryMediaListItems('type', 'episodes'),
        value: 'episodes',
      }
    ]
  }

  getQueryFromOptions(type) {

    const options = [
      {
        label: 'All podcasts',
        onClick: () => this.queryMediaListItems('from', 'all-podcasts'),
        value: 'all-podcasts'
      },
      {
        label: 'Subscribed only',
        onClick: () => this.queryMediaListItems('from', 'subscribed-only'),
        value: 'subscribed-only'
      },
      {
        label: 'From this podcast',
        onClick: () => this.queryMediaListItems('from', 'from-podcast'),
        value: 'from-podcast'
      }
    ]

    if (type === 'clips') {
      options.push(
        {
          label: 'From this episode',
          onClick: () => this.queryMediaListItems('from', 'from-episode'),
          value: 'from-episode'
        }
      )
    }

    return options
  }

  getQuerySortOptions() {
    return [
      {
        label: 'top - past hour',
        onClick: () => this.queryMediaListItems('sort', 'top-past-hour'),
        value: 'top-past-hour'
      },
      {
        label: 'top - past day',
        onClick: () => this.queryMediaListItems('sort', 'top-past-day'),
        value: 'top-past-day'
      },
      {
        label: 'top - past week',
        onClick: () => this.queryMediaListItems('sort', 'top-past-week'),
        value: 'top-past-week'
      },
      {
        label: 'top - past month',
        onClick: () => this.queryMediaListItems('sort', 'top-past-month'),
        value: 'top-past-month'
      },
      {
        label: 'top - past year',
        onClick: () => this.queryMediaListItems('sort', 'top-past-year'),
        value: 'top-past-year'
      },
      {
        label: 'top - all time',
        onClick: () => this.queryMediaListItems('sort', 'top-all-time'),
        value: 'top-all-time'
      },
      {
        label: 'most recent',
        onClick: () => this.queryMediaListItems('sort', 'most-recent'),
        value: 'most-recent'
      }
    ]
  }

  render () {
    const { currentPage, modals, modalsAddToShow, modalsMakeClipShow, user
      } = this.props
    const { addTo, makeClip } = modals
    const { isOpen: addToIsOpen } = addTo
    const { isOpen: makeClipIsOpen } = makeClip
    const { episode, listItems, listItemsLoading, mediaRef, nowPlayingItem,
      podcast } = currentPage
    const { id: userId } = user
    const { queryFrom, querySort, queryType } = this.state

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
      return (
        <MediaListItem
          dataNowPlayingItem={x}
          handleAddToQueueLast={(e) => { this.addToQueue(x, true) }}
          handleAddToQueueNext={(e) => { this.addToQueue(x, false) }}
          handleAnchorOnClick={(e) => { this.anchorOnClick(e, x, 'nowPlayingItem') }}
          handlePlayItem={(e) => { this.playItem(x) }}
          hasLink={true}
          itemType={mediaListItemType}
          key={`nowPlayingListItem-${uuidv4()}`}
          showMoreMenu={true} />
      )
    })

    const selectedQueryTypeOption = this.getQueryTypeOptions().filter(x => x.value === queryType)
    const selectedQueryFromOption = this.getQueryFromOptions(queryType).filter(x => x.value === queryFrom)
    const selectedQuerySortOption = this.getQuerySortOptions().filter(x => x.value === querySort)

    return (
      <Fragment>
        <MediaHeader
          episode={episode}
          mediaRef={mediaRef}
          nowPlayingItem={nowPlayingItem}
          podcast={podcast} />
        <MediaInfo
          episode={episode}
          handleAddToQueueLast={() => this.addToQueue(null, true)}
          handleAddToQueueNext={() => this.addToQueue(null, false)}
          handlePlayItem={() => this.playItem(this.getCurrentPageItem())}
          handleToggleAddToModal={this.toggleAddToModal}
          handleToggleMakeClipModal={this.toggleMakeClipModal}
          loggedInUserId={userId}
          mediaRef={mediaRef}
          nowPlayingItem={nowPlayingItem}
          playing={this.isCurrentlyPlayingItem()}
          podcast={podcast} />
        <div className='media-list'>
          <div className='media-list__selects'>
            <div className='media-list-selects__left'>
              <MediaListSelect
                items={this.getQueryTypeOptions()}
                selected={selectedQueryTypeOption.length > 0 ? selectedQueryTypeOption[0].value : null} />
              <MediaListSelect
                items={this.getQueryFromOptions(queryType)}
                selected={selectedQueryFromOption.length > 0 ? selectedQueryFromOption[0].value : null} />
            </div>
            <div className='media-list-selects__right'>
              <MediaListSelect
                className='align-right'
                items={this.getQuerySortOptions()}
                selected={selectedQuerySortOption.length > 0 ? selectedQuerySortOption[0].value : null} />
            </div>
          </div>
          {
            listItemsLoading ? 
              <div className='media-list__loading'>
                <FontAwesomeIcon 
                  icon='spinner'
                  spin />
              </div>
              : listItemNodes
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageListItemsLoading: bindActionCreators(currentPageListItemsLoading, dispatch),
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch),
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentView)
