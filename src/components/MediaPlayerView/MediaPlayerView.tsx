import React, { Component, Fragment } from 'react'
import { MediaPlayer, popNextFromQueue } from 'podverse-ui'

type Props = {
  nowPlayingItem?: any
  queueSecondaryItems?: any[]
}

type State = {
  autoplay?: boolean
  nowPlayingItem?: any
  playbackRate?: number
  playing?: boolean
  queuePrimaryItems?: any[]
  queueSecondaryItems?: any[]
}

class MediaPlayerView extends Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    const { nowPlayingItem } = this.props

    if (!window.nowPlayingItem || (nowPlayingItem && window.nowPlayingItem && (nowPlayingItem.episodeMediaUrl !== window.nowPlayingItem.episodeMediaUrl))) {
      window.nowPlayingItem = nowPlayingItem
    }

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

  handleAddToQueuePlayLast = (event) => {
    event.preventDefault()
    
  }

  handleAddToQueuePlayNext = (event) => {
    event.preventDefault()
  }

  handleItemSkip = () => {
    const result = popNextFromQueue()

    if (result.nextItem) {
      window.nowPlayingItem = result.nextItem
    }

    this.setState({
      playing: this.state.autoplay,
      queuePrimaryItems: result.primaryItems,
      queueSecondaryItems: result.secondaryItems,
    })
  }

  handleMakeClip = (event) => {
    alert('make clip')
  }

  handleOnEpisodeEnd = () => {
    const { autoplay } = this.state
    
    if (autoplay) {
      this.handleItemSkip()
    } else {
      this.setState({ playing: false })
    }
  }

  handleOnPastClipTime = (shouldPlay) => {
    const { nowPlayingItem } = this.state
    nowPlayingItem.clipStartTime = null
    nowPlayingItem.clipEndTime = null
    nowPlayingItem.clipTitle = null
    this.setState({
      nowPlayingItem,
      playing: shouldPlay
    })
  }

  handlePause = () => {
    this.setState({ playing: false })
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
    const { playing } = this.state
    this.setState({ playing: !playing })
  }

  render () {
    const { queueSecondaryItems } = this.props
    const { autoplay, playbackRate, playing } = this.state
    
    // @ts-ignore
    const nowPlayingItem = process.browser ? window.nowPlayingItem : this.props.nowPlayingItem || {}

    return (
      <Fragment>
        {
          nowPlayingItem &&
            <div className='view__mediaplayer'>
              <MediaPlayer
                autoplay={autoplay}
                handleAddToQueuePlayLast={this.handleAddToQueuePlayLast}
                handleAddToQueuePlayNext={this.handleAddToQueuePlayNext}
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
                playerClipLinkAs='/clip/wfx3yJcSbA'
                playerClipLinkHref='/clip?id=wfx3yJcSbA'
                playerEpisodeLinkHref ='/episode?id=1234'
                playerEpisodeLinkAs='/episode/1234'
                playerPodcastLinkHref='/podcast?id=1234'
                playing={playing}
                queueSecondaryItems={queueSecondaryItems}
                showAutoplay={true} />
            </div>
        }
      </Fragment>
    )
  }
}

export default MediaPlayerView

// Constants
const kAutoplay = 'mediaPlayerAutoplay'
const kPlaybackRate = 'mediaPlayerPlaybackRate'

const getPlaybackRateText = num => {
  switch (num) {
    case 0.5:
      return '0.5x'
    case 0.75:
      return '0.75x'
    case 1:
      return '1x'
    case 1.25:
      return '1.25x'
    case 1.5:
      return '1.5x'
    case 2:
      return '2x'
    default:
      return '1x'
  }
}

const getPlaybackRateNextValue = num => {
  switch (num) {
    case 0.5:
      return 0.75
    case 0.75:
      return 1
    case 1:
      return 1.25
    case 1.25:
      return 1.5
    case 1.5:
      return 2
    case 2:
      return 0.5
    default:
      return 1
  }
}
