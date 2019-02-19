import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaPlayer, popNextFromQueueStorage, setNowPlayingItemInStorage } from 'podverse-ui'
import { kAutoplay, kPlaybackRate, getPlaybackRateText, getPlaybackRateNextValue
  } from '~/lib/constants/misc'
import { mediaPlayerLoadNowPlayingItem, 
  mediaPlayerSetClipFinished, mediaPlayerSetPlayedAfterClipFinished,
  playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  mediaPlayerUpdatePlaying, modalsAddToShow, modalsMakeClipShow,
  modalsQueueShow, modalsShareShow, pageIsLoading, pagesSetQueryState,
  userSetInfo } from '~/redux/actions'
import { addOrUpdateUserHistoryItem, updateUserQueueItems } from '~/services'

type Props = {
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
  pageIsLoading?: any
  pageKey?: string
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  playerQueueLoadSecondaryItems?: any
  user?: any
  userSetInfo?: any
}

type State = {
  autoplay?: boolean
  makeClipIsDeleting?: boolean
  makeClipIsSaving?: boolean
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

  itemSkip = async () => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem,
      mediaPlayerSetPlayedAfterClipFinished, mediaPlayerUpdatePlaying, playerQueue,
      playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems, user, userSetInfo
      } = this.props
    const previousItem = mediaPlayer.nowPlayingItem
    let nextItem
    let priorityItems = []
    let secondaryItems = []

    if (user && user.id) {
      if (user.queueItems && user.queueItems.length > 0) {
        nextItem = user.queueItems.splice(0, 1)[0]
        priorityItems = user.queueItems
        secondaryItems = playerQueue.secondaryItems
      } else if (playerQueue.secondaryItems && playerQueue.secondaryItems.length > 0) {
        nextItem = playerQueue.secondaryItems.splice(0, 1)[0]
        secondaryItems = playerQueue.secondaryItems
      }
    } else {
      if (playerQueue.priorityItems && playerQueue.priorityItems.length > 0) {
        nextItem = playerQueue.priorityItems.splice(0, 1)[0]
        priorityItems = playerQueue.priorityItems
        secondaryItems = playerQueue.secondaryItems
      } else if (playerQueue.secondaryItems && playerQueue.secondaryItems.length > 0) {
        nextItem = playerQueue.secondaryItems.splice(0, 1)[0]
        secondaryItems = playerQueue.secondaryItems
      } else {
        return
      }
      
      popNextFromQueueStorage()
    }

    if (nextItem) {
      // If loading a new episode, clear the player to prevent the error:
      // TypeError: Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.
      // I don't know why this is happening because everywhere I am setting player.seekTo
      // the value should be wrapped in a Math.floor().
      // I also don't understand why this issue happens only for new episodes, but not new clips :(
      if (!nextItem.clipStartTime && nextItem.episodeId !== previousItem.episodeId) {
        window.player = null
      }

      mediaPlayerLoadNowPlayingItem(nextItem)
      setNowPlayingItemInStorage(nextItem)
      mediaPlayerSetPlayedAfterClipFinished(false)

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

        await updateUserQueueItems({ queueItems: priorityItems })
        
        historyItems.push(nextItem)
        
        userSetInfo({ 
          historyItems,
          queueItems: priorityItems
        })
      }
    }

    playerQueueLoadPriorityItems(priorityItems)
    playerQueueLoadSecondaryItems(secondaryItems)
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
    const { autoplay } = this.state

    if (autoplay) {
      this.itemSkip()
    } else {
      this.props.mediaPlayerSetClipFinished()
    }
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
    this.props.mediaPlayerSetPlayedAfterClipFinished(true)
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
    const { mediaPlayer, mediaPlayerUpdatePlaying, user } = this.props
    const { playing } = mediaPlayer
    mediaPlayerUpdatePlaying(!playing)

    if (user && user.id) {
      await addOrUpdateUserHistoryItem(mediaPlayer.nowPlayingItem)
    }
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

    const clipLinkAs = nowPlayingItem.clipId ? `${window.location.host}/clip/${nowPlayingItem.clipId}` : ''
    const episodeLinkAs = `${window.location.host}/episode/${nowPlayingItem.episodeId}`
    const podcastLinkAs = `${window.location.host}/podcast/${nowPlayingItem.podcastId}`

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen,
      podcastLinkAs
    })
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = document.querySelector('.view__contents').scrollTop
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
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
                hasItemInQueue={
                  (priorityItems && priorityItems.length > 0) 
                  || (secondaryItems && secondaryItems.length > 0)
                }
                nowPlayingItem={nowPlayingItem}
                playbackRate={playbackRate}
                playedAfterClipFinished={playedAfterClipFinished}
                playbackRateText={getPlaybackRateText(playbackRate)}
                playerClipLinkAs={nowPlayingItem.clipId ? `/clip/${nowPlayingItem.clipId}` : ''}
                playerClipLinkHref={nowPlayingItem.clipId ? `/clip?id=${nowPlayingItem.clipId}` : ''}
                playerClipLinkOnClick={this.linkClick}
                playerEpisodeLinkAs={`/episode/${nowPlayingItem.episodeId}`}
                playerEpisodeLinkHref={`/episode?id=${nowPlayingItem.episodeId}`}
                playerEpisodeLinkOnClick={this.linkClick}
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
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerSetClipFinished: bindActionCreators(mediaPlayerSetClipFinished, dispatch),
  mediaPlayerSetPlayedAfterClipFinished: bindActionCreators(mediaPlayerSetPlayedAfterClipFinished, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerView)
