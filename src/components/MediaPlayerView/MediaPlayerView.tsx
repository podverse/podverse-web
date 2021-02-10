import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { convertNowPlayingItemClipToNowPlayingItemEpisode } from 'podverse-shared'
import { MediaPlayer, popNextFromQueueStorage } from 'podverse-ui'
import { addOrUpdateHistoryItemAndState, generateShareURLs, getViewContentsElementScrollTop } from '~/lib/utility'
import { getPlaybackRateText, getPlaybackRateNextValue } from '~/lib/utility'
import PV from '~/lib/constants'
import { mediaPlayerLoadNowPlayingItem, 
  mediaPlayerSetClipFinished, mediaPlayerSetPlayedAfterClipFinished,
  playerQueueLoadPriorityItems, mediaPlayerUpdatePlaying, modalsAddToShow,
  modalsMakeClipShow, modalsShareShow, modalsSupportShow, pageIsLoading,
  pagesSetQueryState, userSetInfo } from '~/redux/actions'
import { setNowPlayingItem } from '~/services'
import { popNextFromQueueFromServer } from '~/services/userQueueItem'

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
  modalsShareShow?: any
  modalsSupportShow?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
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
      playerQueueLoadPriorityItems, user, userSetInfo
      } = this.props
    const previousItem = mediaPlayer.nowPlayingItem
    let nextItem
    let priorityItems = []

    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemAndState(previousItem, user, currentTime)
    }

    if (user && user.id) {
      const results = await popNextFromQueueFromServer() as any
      nextItem = results.nextItem
      priorityItems = results.userQueueItems
    } else {
      if (playerQueue.priorityItems && playerQueue.priorityItems.length > 0) {
        nextItem = playerQueue.priorityItems.splice(0, 1)[0]
        priorityItems = playerQueue.priorityItems
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
      await setNowPlayingItem(nextItem, nextItem.userPlaybackPosition, user)

      if (user && user.id) {
        const historyItems = await addOrUpdateHistoryItemAndState(nextItem, user)
        
        userSetInfo({ 
          historyItems,
          queueItems: priorityItems
        })
      }

      mediaPlayerSetPlayedAfterClipFinished(false)
    }

    playerQueueLoadPriorityItems(priorityItems)
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

    await addOrUpdateHistoryItemAndState(nowPlayingItem, user, 0)
    
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
    await addOrUpdateHistoryItemAndState(mediaPlayer.nowPlayingItem, user)
  }

  playbackRateClick = () => {
    const { playbackRate } = this.state
    const nextPlaybackRate = getPlaybackRateNextValue(playbackRate)
    this.setPlaybackRateValue(nextPlaybackRate)
    this.setState({ playbackRate: nextPlaybackRate })
  }

  setPlayedAfterClipFinished = async () => {
    const { mediaPlayer, user } = this.props
    const { nowPlayingItem } = mediaPlayer
    this.props.mediaPlayerSetPlayedAfterClipFinished(true)
    if (nowPlayingItem) {
      const nowPlayingItemEpisode = convertNowPlayingItemClipToNowPlayingItemEpisode(nowPlayingItem)
      if (nowPlayingItemEpisode) {
        await addOrUpdateHistoryItemAndState(mediaPlayer.nowPlayingItem, user)
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
      await addOrUpdateHistoryItemAndState(mediaPlayer.nowPlayingItem, user)
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

  toggleSupportModal = () => {
    const { mediaPlayer, modals, modalsSupportShow } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { support } = modals
    const { isOpen } = support

    if (!nowPlayingItem) return

    modalsSupportShow({
      episodeFunding: nowPlayingItem.episodeFunding || [],
      isOpen: !isOpen,
      podcastFunding: nowPlayingItem.podcastFunding || [],
      podcastShrunkImageUrl: nowPlayingItem.podcastShrunkImageUrl,
      podcastTitle: nowPlayingItem.podcastTitle,
      podcastValue: nowPlayingItem.podcastValue || []
    })
  }

  render() {
    const { isMobileDevice, mediaPlayer, playerQueue, settings } = this.props
    const { clipFinished, didWaitToLoad, nowPlayingItem, playedAfterClipFinished, playing } = mediaPlayer
    const { priorityItems } = playerQueue
    const { playbackSpeedButtonHide } = settings
    const { autoplay, playbackRate } = this.state

    if (!nowPlayingItem) return null
    const { episodeFunding, podcastFunding } = nowPlayingItem
    const showSupport = (episodeFunding && episodeFunding.length > 0) ||
      (podcastFunding && podcastFunding.length > 0)

    return (
      <Fragment>
        <div className='view__mediaplayer'>
          <MediaPlayer
            autoplay={autoplay}
            clipFinished={clipFinished}
            didWaitToLoad={didWaitToLoad}
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
            handleToggleSupportModal={this.toggleSupportModal}
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
            showAutoplay={!isMobileDevice}
            showPlaybackSpeed={playbackSpeedButtonHide === 'false' || !playbackSpeedButtonHide}
            showSupport={showSupport} />
        </div>
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
  modalsSupportShow: bindActionCreators(modalsSupportShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerView)
