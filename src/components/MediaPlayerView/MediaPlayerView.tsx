import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { MediaPlayer, getPriorityQueueItemsStorage, getSecondaryQueueItemsStorage, popNextFromQueueStorage
  } from 'podverse-ui'
import { kAutoplay, kPlaybackRate, getPlaybackRateText, getPlaybackRateNextValue
  } from '~/lib/constants'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { currentPageLoadNowPlayingItem, mediaPlayerLoadNowPlayingItem,
  playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems, mediaPlayerUpdatePlaying} from '~/redux/actions'

type Props = {
  currentPageLoadNowPlayingItem?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  playerQueueLoadSecondaryItems?: any
}

type State = {
  autoplay?: boolean
  playbackRate?: number
}

class MediaPlayerView extends Component<Props, State> {

  static defaultProps: Props = {
    mediaPlayer: {
      nowPlayingItem: {}
    }
  }

  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    const autoplay = this.getAutoplayValue()
    const playbackRate = this.getPlaybackRateValue()

    this.setState({ 
      autoplay,
      playbackRate
    })
  }

  getAutoplayValue = () => {
    const autoplay = localStorage.getItem(kAutoplay)
    return autoplay ? JSON.parse(autoplay) : false
  }

  setAutoplayValue = (val) => {
    localStorage.setItem(kAutoplay, val)
  }

  getPlaybackRateValue = () => {
    const playbackRate = localStorage.getItem(kPlaybackRate)
    return playbackRate ? JSON.parse(playbackRate) : 1
  }

  setPlaybackRateValue = (val) => {
    localStorage.setItem(kPlaybackRate, val)
  }

  handleAddToQueueLast = (event) => {
    event.preventDefault()
    
  }

  handleAddToQueueNext = (event) => {
    event.preventDefault()
  }

  handleAnchorOnClick(event, nowPlayingItem, itemType) {
    const { currentPageLoadNowPlayingItem } = this.props

    if (itemType === 'episode') {
      nowPlayingItem.clipEndTime = 0
      nowPlayingItem.clipTitle = 0
      nowPlayingItem.clipStartTime = 0
      currentPageLoadNowPlayingItem(nowPlayingItem)
    } else if (itemType === 'mediaRef') {
      currentPageLoadNowPlayingItem(nowPlayingItem)
    }

    scrollToTopOfView()
  }

  handleItemSkip = () => {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, 
      playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems } = this.props
    
    const result = popNextFromQueueStorage()
    const priorityQueueItems = getPriorityQueueItemsStorage()
    const secondaryQueueItems = getSecondaryQueueItemsStorage()

    if (result.nextItem) {
      mediaPlayerLoadNowPlayingItem(result.nextItem)
    }

    playerQueueLoadPriorityItems(priorityQueueItems)
    playerQueueLoadSecondaryItems(secondaryQueueItems)
    mediaPlayerUpdatePlaying(this.state.autoplay)
  }

  handleMakeClip = (event) => {
    alert('make clip')
  }

  handleOnEpisodeEnd = () => {
    const { autoplay } = this.state
    
    if (autoplay) {
      this.handleItemSkip()
    } else {
      this.props.mediaPlayerUpdatePlaying(false)
    }
  }

  handleOnPastClipTime = (shouldPlay) => {
    // const { nowPlayingItem } = this.state
    // nowPlayingItem.clipStartTime = null
    // nowPlayingItem.clipEndTime = null
    // nowPlayingItem.clipTitle = null
    // this.setState({
    //   nowPlayingItem,
    //   playing: shouldPlay
    // })
  }

  handlePause = () => {
    this.props.mediaPlayerUpdatePlaying(false)
  }

  handlePlaybackRateClick = () => {
    const { playbackRate } = this.state
    const nextPlaybackRate = getPlaybackRateNextValue(playbackRate)
    this.setPlaybackRateValue(nextPlaybackRate)
    this.setState({ playbackRate: nextPlaybackRate })
  }

  handlePlaylistCreate = () => {
    alert('create playlist')
  }

  handlePlaylistItemAdd = (event) => {
    event.preventDefault()
    alert('add item to playlist')
  }

  handleQueueItemClick = () => {
    alert('queue item clicked')
  }

  handleToggleAutoplay = () => {
    const autoplay = this.getAutoplayValue()
    this.setAutoplayValue(!autoplay)
    this.setState({ autoplay: !autoplay })
  }

  handleTogglePlay = () => {
    const { mediaPlayer, mediaPlayerUpdatePlaying } = this.props
    const { playing } = mediaPlayer
    mediaPlayerUpdatePlaying(!playing)
  }

  render () {
    const { mediaPlayer, playerQueue } = this.props
    const { nowPlayingItem, playing } = mediaPlayer
    const { priorityItems, secondaryItems } = playerQueue
    const { autoplay, playbackRate } = this.state
    
    return (
      <Fragment>
        {
          nowPlayingItem &&
            <div className='view__mediaplayer'>
              <MediaPlayer
                autoplay={autoplay}
                handleAddToQueueLast={this.handleAddToQueueLast}
                handleAddToQueueNext={this.handleAddToQueueNext}
                handleItemSkip={this.handleItemSkip}
                handleMakeClip={this.handleMakeClip}
                handleOnEpisodeEnd={this.handleOnEpisodeEnd}
                handleOnPastClipTime={this.handleOnPastClipTime}
                handleQueueItemClick={this.handleQueueItemClick}
                handlePause={this.handlePause}
                handlePlaybackRateClick={this.handlePlaybackRateClick}
                handlePlaylistCreate={this.handlePlaylistCreate}
                handlePlaylistItemAdd={this.handlePlaylistItemAdd}
                handleToggleAutoplay={this.handleToggleAutoplay}
                handleTogglePlay={this.handleTogglePlay}
                nowPlayingItem={nowPlayingItem}
                playbackRate={playbackRate}
                playbackRateText={getPlaybackRateText(playbackRate)}
                playerClipLinkAs={`/clip/${nowPlayingItem.clipId}`}
                playerClipLinkHref={`/clip?id=${nowPlayingItem.clipId}`}
                playerClipLinkOnClick={(evt) => { this.handleAnchorOnClick(evt, nowPlayingItem, 'mediaRef') }}
                playerEpisodeLinkAs={`/episode/${nowPlayingItem.episodeId}`}
                playerEpisodeLinkHref={`/episode?id=${nowPlayingItem.episodeId}`}
                playerEpisodeLinkOnClick={(evt) => { this.handleAnchorOnClick(evt, nowPlayingItem, 'episode') }}
                playing={playing}
                queuePriorityItems={priorityItems}
                queueSecondaryItems={secondaryItems}
                showAutoplay={true} />
            </div>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch),
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerView)
