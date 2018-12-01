import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaPlayer, getPriorityQueueItemsStorage, getSecondaryQueueItemsStorage,
  popNextFromQueueStorage } from 'podverse-ui'
import { kAutoplay, kPlaybackRate, getPlaybackRateText, getPlaybackRateNextValue
  } from '~/lib/constants'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { currentPageLoadNowPlayingItem, mediaPlayerLoadNowPlayingItem, 
  mediaPlayerSetClipFinished, mediaPlayerSetPlayedAfterClipFinished,
  playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  mediaPlayerUpdatePlaying, modalsAddToShow, modalsMakeClipShow,
  modalsQueueShow, modalsShareShow, userSetInfo } from '~/redux/actions'
import { addOrUpdateUserHistoryItem } from '~/services'

type Props = {
  currentPageLoadNowPlayingItem?: any
  handleMakeClip?: Function
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerSetClipFinished?: any
  mediaPlayerSetPlayedAfterClipFinished?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
  modalsMakeClipShow?: any
  modalsQueueShow?: any
  modalsShareShow?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  playerQueueLoadSecondaryItems?: any
  user?: any
  userSetInfo?: any
}

type State = {
  autoplay?: boolean
  makeClipIsLoading?: boolean
  playbackRate?: number
}

class MediaPlayerView extends Component<Props, State> {

  static defaultProps: Props = {
    mediaPlayer: {
      nowPlayingItem: {}
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
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

  anchorOnClick(event, nowPlayingItem, itemType) {
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

  itemSkip = async () => {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems, user,
      userSetInfo } = this.props

    const result = popNextFromQueueStorage()
    const priorityQueueItems = getPriorityQueueItemsStorage()
    const secondaryQueueItems = getSecondaryQueueItemsStorage()

    if (result.nextItem) {
      const { nextItem } = result
      mediaPlayerLoadNowPlayingItem(nextItem)

      if (user && user.id) {
        await addOrUpdateUserHistoryItem(nextItem)
        const historyItems = user.historyItems.filter(x => {
          if (x) {
            if ((x.clipStartTime || x.clipEndTime) && x.clipId !== nextItem.clipId) {
              return x
            } else if (x.episodeId !== nextItem.episodeId) {
              return x
            }
          }
        })

        historyItems.push(nextItem)

        userSetInfo({ historyItems })
      }
    }

    playerQueueLoadPriorityItems(priorityQueueItems)
    playerQueueLoadSecondaryItems(secondaryQueueItems)
    mediaPlayerUpdatePlaying(this.state.autoplay)
  }

  onEpisodeEnd = () => {
    const { autoplay } = this.state

    if (autoplay) {
      this.itemSkip()
    } else {
      this.props.mediaPlayerUpdatePlaying(false)
    }
  }

  onPastClipTime = () => {
    this.props.mediaPlayerSetClipFinished()
  }

  pause = () => {
    this.props.mediaPlayerUpdatePlaying(false)
  }

  playbackRateClick = () => {
    const { playbackRate } = this.state
    const nextPlaybackRate = getPlaybackRateNextValue(playbackRate)
    this.setPlaybackRateValue(nextPlaybackRate)
    this.setState({ playbackRate: nextPlaybackRate })
  }

  setPlayedAfterClipFinished = () => {
    this.props.mediaPlayerSetPlayedAfterClipFinished()
  }

  toggleAddToModal = () => {
    const { mediaPlayer, modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo
    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem: mediaPlayer.nowPlayingItem,
      showQueue: false
    })
  }

  toggleAutoplay = () => {
    const autoplay = this.getAutoplayValue()
    this.setAutoplayValue(!autoplay)
    this.setState({ autoplay: !autoplay })
  }

  toggleMakeClipModal = () => {
    const { mediaPlayer, modals, modalsMakeClipShow } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { makeClip } = modals
    const { isOpen } = makeClip

    modalsMakeClipShow({
      isEditing: false,
      isOpen: !isOpen,
      nowPlayingItem
    })
  }

  togglePlay = async () => {
    const { mediaPlayer, mediaPlayerUpdatePlaying } = this.props
    const { playing } = mediaPlayer
    mediaPlayerUpdatePlaying(!playing)

    await addOrUpdateUserHistoryItem(mediaPlayer.nowPlayingItem)
  }

  toggleQueueModal = () => {
    const { modals, modalsQueueShow } = this.props
    const { queue } = modals
    const { isOpen } = queue
    modalsQueueShow(!isOpen)
  }

  toggleShareModal = () => {
    const { mediaPlayer, modals, modalsShareShow } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { share } = modals
    const { isOpen } = share

    const clipLinkAs = `/clip/${nowPlayingItem.clipId}`
    const episodeLinkAs = `/episode/${nowPlayingItem.episodeId}`
    const podcastLinkAs = `/podcast/${nowPlayingItem.podcastId}`

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen,
      podcastLinkAs
    })
  }

  render() {
    const { mediaPlayer, playerQueue } = this.props
    const { clipFinished, nowPlayingItem, playedAfterClipFinished, playing } = mediaPlayer
    const { priorityItems, secondaryItems } = playerQueue
    const { autoplay, playbackRate } = this.state

    return (
      <Fragment>
        {
          nowPlayingItem &&
          <Fragment>
            <div className='view__mediaplayer-spacer' />
            <div className='view__mediaplayer'>
              <MediaPlayer
                autoplay={autoplay}
                clipFinished={clipFinished}
                handleItemSkip={this.itemSkip}
                handleOnEpisodeEnd={this.onEpisodeEnd}
                handleOnPastClipTime={this.onPastClipTime}
                handlePause={this.pause}
                handlePlaybackRateClick={this.playbackRateClick}
                handleSetPlayedAfterClipFinished={this.setPlayedAfterClipFinished}
                handleToggleAddToModal={this.toggleAddToModal}
                handleToggleAutoplay={this.toggleAutoplay}
                handleToggleMakeClipModal={this.toggleMakeClipModal}
                handleToggleQueueModal={this.toggleQueueModal}
                handleToggleShareModal={this.toggleShareModal}
                handleTogglePlay={this.togglePlay}
                nowPlayingItem={nowPlayingItem}
                playbackRate={playbackRate}
                playedAfterClipFinished={playedAfterClipFinished}
                playbackRateText={getPlaybackRateText(playbackRate)}
                playerClipLinkAs={`/clip/${nowPlayingItem.clipId}`}
                playerClipLinkHref={`/clip?id=${nowPlayingItem.clipId}`}
                playerClipLinkOnClick={(evt) => { this.anchorOnClick(evt, nowPlayingItem, 'mediaRef') }}
                playerEpisodeLinkAs={`/episode/${nowPlayingItem.episodeId}`}
                playerEpisodeLinkHref={`/episode?id=${nowPlayingItem.episodeId}`}
                playerEpisodeLinkOnClick={(evt) => { this.anchorOnClick(evt, nowPlayingItem, 'episode') }}
                playing={playing}
                queuePriorityItems={priorityItems}
                queueSecondaryItems={secondaryItems}
                showAutoplay={true} />
            </div>
          </Fragment>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch),
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerSetClipFinished: bindActionCreators(mediaPlayerSetClipFinished, dispatch),
  mediaPlayerSetPlayedAfterClipFinished: bindActionCreators(mediaPlayerSetPlayedAfterClipFinished, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerView)
