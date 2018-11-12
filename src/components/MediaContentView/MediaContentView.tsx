
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage } from 'podverse-ui'
import { mediaListSelectItemsPlayer, mediaListSubSelectItemsPlayer, 
  mediaListSubSelectItemsSort } from '~/lib/constants'
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
}

type State = {}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    currentPage: {
      listItems: []
    }
  }

  constructor (props) {
    super(props)
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

  render () {
    const { currentPage } = this.props
    const { episode, listItems, mediaRef, nowPlayingItem, podcast } = currentPage

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
            items={mediaListSelectItemsPlayer}
            selected={mediaListSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsPlayer}
            selected={mediaListSubSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsSort}
            selected={mediaListSubSelectItemsSort[0].value} />
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
