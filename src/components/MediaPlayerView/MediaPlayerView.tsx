import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { convertNowPlayingItemClipToNowPlayingItemEpisode } from 'podverse-shared'
import { MediaPlayer, popNextFromQueueStorage, setNowPlayingItemInStorage } from 'podverse-ui'
import { addOrUpdateHistoryItemPlaybackPosition, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  generateShareURLs, getPlaybackPositionFromHistory, getViewContentsElementScrollTop } from '~/lib/utility'
import { getPlaybackRateText, getPlaybackRateNextValue } from '~/lib/utility'
import PV from '~/lib/constants'
import { mediaPlayerLoadNowPlayingItem, 
  mediaPlayerSetClipFinished, mediaPlayerSetPlayedAfterClipFinished,
  playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems,
  mediaPlayerUpdatePlaying, modalsAddToShow, modalsMakeClipShow,
  modalsShareShow, pageIsLoading, pagesSetQueryState,
  userSetInfo } from '~/redux/actions'
import { updateUserQueueItems, addOrUpdateUserHistoryItem } from '~/services'

type Props = {
  handleMakeClip?: Function
  isMobileDevice?: boolean
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
  pagesSetQueryState?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  playerQueueLoadSecondaryItems?: any
  settings?: any
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
    try {
      const autoplay = localStorage.getItem(PV.storageKeys.kAutoplay)
      return autoplay ? JSON.parse(autoplay) : false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  setAutoplayValue = (val) => {
    localStorage.setItem(PV.storageKeys.kAutoplay, val)
  }

  getPlaybackRateValue = () => {
    try {
      const playbackRate = localStorage.getItem(PV.storageKeys.kPlaybackRate)
      return playbackRate ? JSON.parse(playbackRate) : 1
    } catch (error) {
      console.log(error)
    }
  }

  setPlaybackRateValue = (val) => {
    localStorage.setItem(PV.storageKeys.kPlaybackRate, val)
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

    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemPlaybackPosition(previousItem, user, currentTime)
    }

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

      nextItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nextItem)
      mediaPlayerLoadNowPlayingItem(nextItem)
      setNowPlayingItemInStorage(nextItem)

      if (user && user.id) {
        await addOrUpdateHistoryItemPlaybackPosition(nextItem, user)
        // eslint-disable-next-line array-callback-return
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

      mediaPlayerSetPlayedAfterClipFinished(false)
    }

    playerQueueLoadPriorityItems(priorityItems)
    playerQueueLoadSecondaryItems(secondaryItems)
    mediaPlayerUpdatePlaying(this.state.autoplay)
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

  onEpisodeEnd = async () => {
    const { mediaPlayer, user } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { autoplay } = this.state

    await addOrUpdateHistoryItemPlaybackPosition(nowPlayingItem, user, 0)
    
    if (autoplay) {
      this.itemSkip()
    } else {
      this.props.mediaPlayerUpdatePlaying(false)
    }
  }

  onPastClipTime = () => {
    const { autoplay } = this.state

    if (autoplay) {
      this.props.mediaPlayerSetPlayedAfterClipFinished(true)
      this.itemSkip()
    } else {
      this.props.mediaPlayerSetClipFinished(true)
    }
  }

  pause = async () => {
    const { mediaPlayer, user } = this.props
    this.props.mediaPlayerUpdatePlaying(false)
    await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user)
  }

  playbackRateClick = () => {
    const { playbackRate } = this.state
    const nextPlaybackRate = getPlaybackRateNextValue(playbackRate)
    this.setPlaybackRateValue(nextPlaybackRate)
    this.setState({ playbackRate: nextPlaybackRate })
  }

  setPlayedAfterClipFinished = () => {
    const { mediaPlayer } = this.props
    const { nowPlayingItem } = mediaPlayer
    this.props.mediaPlayerSetPlayedAfterClipFinished(true)
    if (nowPlayingItem) {
      const nowPlayingItemEpisode = convertNowPlayingItemClipToNowPlayingItemEpisode(nowPlayingItem)
      if (nowPlayingItemEpisode) {
        addOrUpdateUserHistoryItem(nowPlayingItemEpisode)
      }
    }
  }

  toggleAddToPlaylistModal = () => {
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

    if (playing) {
      await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user)
    }
  }

  toggleShareModal = () => {
    const { mediaPlayer, modals, modalsShareShow } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { share } = modals
    const { isOpen } = share

    const { clipLinkAs, episodeLinkAs, podcastLinkAs } = generateShareURLs(nowPlayingItem)

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen,
      podcastLinkAs
    })
  }

  render() {
    const { isMobileDevice, mediaPlayer, playerQueue, settings, user } = this.props
    const { clipFinished, didWaitToLoad, nowPlayingItem, playedAfterClipFinished, playing } = mediaPlayer
    const { priorityItems, secondaryItems } = playerQueue
    const { playbackSpeedButtonHide } = settings
    const { autoplay, playbackRate } = this.state

    return (
      <Fragment>
        {
          nowPlayingItem &&
          <Fragment>
            <div className='view__mediaplayer'>
              <MediaPlayer
                autoplay={autoplay}
                clipFinished={clipFinished}
                didWaitToLoad={didWaitToLoad}
                handleGetPlaybackPositionFromHistory={user && user.id ? () => getPlaybackPositionFromHistory(user.historyItems, nowPlayingItem) : null}
                handleItemSkip={this.itemSkip}
                handleOnEpisodeEnd={this.onEpisodeEnd}
                handleOnPastClipTime={this.onPastClipTime}
                handlePause={this.pause}
                handlePlaybackRateClick={this.playbackRateClick}
                handleSetPlayedAfterClipFinished={this.setPlayedAfterClipFinished}
                handletoggleAddToPlaylistModal={this.toggleAddToPlaylistModal}
                handleToggleAutoplay={this.toggleAutoplay}
                handleToggleMakeClipModal={this.toggleMakeClipModal}
                handleToggleShareModal={this.toggleShareModal}
                handleTogglePlay={this.togglePlay}
                nowPlayingItem={nowPlayingItem}
                playbackRate={playbackRate}
                playedAfterClipFinished={playedAfterClipFinished}
                playbackRateText={getPlaybackRateText(playbackRate)}
                playerClipLinkAs={nowPlayingItem.clipId ? `${PV.paths.web.clip}/${nowPlayingItem.clipId}` : ''}
                playerClipLinkHref={nowPlayingItem.clipId ? `${PV.paths.web.clip}?id=${nowPlayingItem.clipId}` : ''}
                playerClipLinkOnClick={this.linkClick}
                playerEpisodeLinkAs={`${PV.paths.web.episode}/${nowPlayingItem.episodeId}`}
                playerEpisodeLinkHref={`${PV.paths.web.episode}?id=${nowPlayingItem.episodeId}`}
                playerEpisodeLinkOnClick={this.linkClick}
                playing={playing}
                queuePriorityItems={priorityItems}
                queueSecondaryItems={secondaryItems}
                showAutoplay={!isMobileDevice}
                showPlaybackSpeed={playbackSpeedButtonHide === 'false' || !playbackSpeedButtonHide} />
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
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerView)
