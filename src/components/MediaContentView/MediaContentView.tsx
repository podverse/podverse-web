
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage } from 'podverse-ui'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { bindActionCreators } from 'redux';
import { currentPageLoadNowPlayingItem, mediaPlayerLoadNowPlayingItem,
  mediaPlayerUpdatePlaying, playerQueueLoadPriorityItems } from '~/redux/actions';
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem';

type Props = {
  currentPage?: any
  currentPageLoadNowPlayingItem?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  queryFrom?: string
  querySort?: string
  queryType?: string
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
  }

  handleAddToQueue(nowPlayingItem, isLast) {
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

  handleAnchorOnClick (event, data, itemType) {
    const { currentPageLoadNowPlayingItem } = this.props

    if (itemType === 'episode') {
      // newState.episode = data
    } else if (itemType === 'mediaRef') {
      // newState.mediaRef = data
    } else if (itemType === 'nowPlayingItem') {
      currentPageLoadNowPlayingItem(data)
    } else if (itemType === 'podcast') {
      // newState.podcast = data
    }

    scrollToTopOfView()
  }

  handlePlayItem(nowPlayingItem) {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying } = this.props
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)

    if (this.isCurrentlyPlayingItem()) {
      mediaPlayerUpdatePlaying(false)
    } else {
      mediaPlayerUpdatePlaying(true)
    }
  }

  isCurrentlyPlayingItem() {
    const { currentPage, mediaPlayer } = this.props
    const { episode, mediaRef, nowPlayingItem } = currentPage
    const { nowPlayingItem: mpNowPlayingItem, playing } = mediaPlayer
    
    return (
      playing
      && ((episode && episode.mediaUrl === mpNowPlayingItem.episodeMediaUrl)
      || (mediaRef && mediaRef.episodeMediaUrl === mpNowPlayingItem.episodeMediaUrl)
      || (nowPlayingItem && nowPlayingItem.episodeMediaUrl === mpNowPlayingItem.episodeMediaUrl))
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
    const { queryFrom, querySort, queryType } = this.props
    
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

  getQueryFromOptions() {
    return [
      {
        label: 'From this podcast',
        onClick: () => this.queryMediaListItems('from', 'from-podcast'),
        value: 'from-podcast'
      },
      {
        label: 'From this episode',
        onClick: () => this.queryMediaListItems('from', 'from-episode'),
        value: 'from-episode'
      },
      {
        label: 'All podcasts',
        onClick: () => this.queryMediaListItems('from', 'all-podcasts'),
        value: 'all-podcasts'
      },
      {
        label: 'Subscribed only',
        onClick: () => this.queryMediaListItems('from', 'subscribed-only'),
        value: 'subscribed-only'
      }
    ]
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
    const { currentPage } = this.props
    const { episode, listItems, mediaRef, nowPlayingItem, podcast } = currentPage
    const { queryFrom, querySort, queryType } = this.state

    const listItemNodes = listItems.map((x, index) =>
      <MediaListItem
        dataNowPlayingItem={x}
        handleAddToQueueLast={(e) => { this.handleAddToQueue(x, true) }}
        handleAddToQueueNext={(e) => { this.handleAddToQueue(x, false) }}
        handleAnchorOnClick={(e) => { this.handleAnchorOnClick(e, x, 'nowPlayingItem') }}
        handlePlayItem={(e) => { this.handlePlayItem(x) }}
        hasLink={true}
        itemType='now-playing-item'
        key={`nowPlayingListItem${index}`}
        showMoreMenu={true} />
    )

    return (
      <Fragment>
        <MediaHeader
          episode={episode}
          mediaRef={mediaRef}
          nowPlayingItem={nowPlayingItem}
          podcast={podcast} />
        <MediaInfo
          episode={episode}
          handleAddToQueueLast={() => this.handleAddToQueue(null, true)}
          handleAddToQueueNext={() => this.handleAddToQueue(null, false)}
          handlePlayItem={() => {
            if (episode) {
              this.handlePlayItem(convertToNowPlayingItem(episode))
            } else if (mediaRef) {
              this.handlePlayItem(convertToNowPlayingItem(mediaRef))
            } else if (nowPlayingItem) {
              this.handlePlayItem(nowPlayingItem)
            }
          }}
          mediaRef={mediaRef}
          nowPlayingItem={nowPlayingItem}
          playing={this.isCurrentlyPlayingItem()}
          podcast={podcast} />
        <div className='media-list'>
          <MediaListSelect
            items={this.getQueryTypeOptions()}
            selected={this.getQueryTypeOptions().filter(x => x.value === queryType)[0].value} />
          <MediaListSelect
            items={this.getQueryFromOptions()}
            selected={this.getQueryFromOptions().filter(x => x.value === queryFrom)[0].value} />
          <MediaListSelect
            items={this.getQuerySortOptions()}
            selected={this.getQuerySortOptions().filter(x => x.value === querySort)[0].value} />
          {listItemNodes}
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch),
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentView)
