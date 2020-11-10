
import React, { Component, Fragment } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { convertToNowPlayingItem } from 'podverse-shared'
import { MediaInfo, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import PV from '~/lib/constants'
import { addOrUpdateHistoryItemPlaybackPosition, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  getViewContentsElementScrollTop, generateShareURLs, removeProtocol} from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerSetClipFinished, mediaPlayerSetPlayedAfterClipFinished, 
  mediaPlayerUpdatePlaying, modalsAddToShow, modalsMakeClipShow, modalsShareShow,
  pageIsLoading, pagesSetQueryState, playerQueueLoadPriorityItems,
  userSetInfo } from '~/redux/actions'
import { updateUserQueueItems } from '~/services'
import { i18n, withTranslation } from '~/../i18n'

type Props = {
  episode?: any
  initialShowDescription?: boolean
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerSetClipFinished?: any
  mediaPlayerSetPlayedAfterClipFinished?: any
  mediaPlayerUpdatePlaying?: any
  mediaRef?: any
  modals?: any
  modalsAddToShow?: any
  modalsMakeClipShow?: any
  modalsShareShow?: any
  nowPlayingItem?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  playerQueueLoadPriorityItems?: any
  podcast?: any
  settings?: any
  showDescription?: boolean
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

interface MediaInfoCtrl {
  makeClipInputStartTime: any
  makeClipInputEndTime: any
  makeClipInputTitle: any
}

class MediaInfoCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  playItem = async (nowPlayingItem, loadOnly = false, setPosition = false) => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, user,
      userSetInfo } = this.props
    
    if (window.player) {
      const currentTime = Math.floor(window.player.getCurrentTime()) || 0
      await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user, currentTime)
    }

    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)

    if (!loadOnly) {
      mediaPlayerUpdatePlaying(true)
    }

    if (
      !mediaPlayer.nowPlayingItem ||
      nowPlayingItem.clipId && (mediaPlayer.nowPlayingItem.clipId !== nowPlayingItem.clipId) ||
      nowPlayingItem.episodeId && (mediaPlayer.nowPlayingItem.episodeId !== nowPlayingItem.episodeId)
    ) {
      mediaPlayerLoadNowPlayingItem(nowPlayingItem)
      setNowPlayingItemInStorage(nowPlayingItem)

      if (window.player && setPosition && nowPlayingItem && nowPlayingItem.clipStartTime) {
        window.player.seekTo(Math.floor(nowPlayingItem.clipStartTime))
      }

      if (user && user.id) {
        await addOrUpdateHistoryItemPlaybackPosition(nowPlayingItem, user)
  
        // eslint-disable-next-line array-callback-return
        const historyItems = user.historyItems.filter(x => {
          if (x) {
            if ((x.clipStartTime || x.clipEndTime) && x.clipId !== nowPlayingItem.clipId) {
              return x
            } else if (x.episodeId !== nowPlayingItem.episodeId) {
              return x
            }
          }
        })
  
        historyItems.push(nowPlayingItem)
  
        userSetInfo({ historyItems })
      }
    } else if (setPosition) {
      if (window.player && nowPlayingItem && nowPlayingItem.clipStartTime) {
        this.props.mediaPlayerSetClipFinished(false)
        this.props.mediaPlayerSetPlayedAfterClipFinished(false)
        window.player.seekTo(Math.floor(nowPlayingItem.clipStartTime))
      }
    }
  }

  pauseItem = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(false)
  }

  addToQueue = async (nowPlayingItem, isLast) => {
    const { episode, mediaRef, playerQueueLoadPriorityItems, user } = this.props
    
    let priorityItems = []
    user.queueItems = Array.isArray(user.queueItems) ? user.queueItems : []
    if (user && user.id) {
      if (nowPlayingItem && nowPlayingItem.episodeMediaUrl) {
        isLast ? user.queueItems.push(nowPlayingItem) : user.queueItems.unshift(nowPlayingItem)
      } else if (mediaRef) {
        isLast ? user.queueItems.push(convertToNowPlayingItem(mediaRef)) : user.queueItems.unshift(convertToNowPlayingItem(mediaRef))
      } else if (episode) {
        isLast ? user.queueItems.push(convertToNowPlayingItem(episode)) : user.queueItems.unshift(convertToNowPlayingItem(episode))
      }

      const response = await updateUserQueueItems({ queueItems: user.queueItems })

      priorityItems = response.data || []
    } else {
      if (nowPlayingItem && nowPlayingItem.episodeMediaUrl) {
        addItemToPriorityQueueStorage(nowPlayingItem, isLast)
      } else if (mediaRef) {
        addItemToPriorityQueueStorage(convertToNowPlayingItem(mediaRef))
      } else if (episode) {
        addItemToPriorityQueueStorage(convertToNowPlayingItem(episode))
      }

      priorityItems = getPriorityQueueItemsStorage()
    }

    playerQueueLoadPriorityItems(priorityItems)
  }

  toggleAddToPlaylistModal = () => {
    const { modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo

    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem: this.getCurrentPageItem()
    })
  }

  toggleEditClipModal = () => {
    const { modals, modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { isOpen } = makeClip

    if (!this.isCurrentlyPlayingItem()) {
      this.playItem(this.getCurrentPageItem(), true)
    }

    modalsMakeClipShow({})

    modalsMakeClipShow({
      isEditing: true,
      isOpen: !isOpen,
      nowPlayingItem: this.getCurrentPageItem()
    })
  }

  toggleMakeClipModal = () => {
    const { modals, modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { isOpen } = makeClip

    if (!this.isCurrentlyPlayingItem()) {
      this.playItem(this.getCurrentPageItem(), true)
    }

    modalsMakeClipShow({
      isEditing: false,
      isOpen: !isOpen,
      nowPlayingItem: this.getCurrentPageItem()
    })
  }

  toggleShareModal = () => {
    const { modals, modalsShareShow } = this.props
    const { share } = modals
    const { isOpen } = share
    const nowPlayingItem = this.getCurrentPageItem()

    const { clipLinkAs, episodeLinkAs, podcastLinkAs } = generateShareURLs(nowPlayingItem)

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen,
      podcastLinkAs
    })
  }

  getCurrentPageItem = () => {
    const { episode, mediaRef, nowPlayingItem } = this.props

    if (mediaRef) {
      return convertToNowPlayingItem(mediaRef)
    } else if (episode) {
      return convertToNowPlayingItem(episode)
    } else if (nowPlayingItem) {
      return nowPlayingItem
    }
  }

  isCurrentlyPlayingItem = () => {
    const { episode, mediaRef, mediaPlayer, nowPlayingItem } = this.props
    const { nowPlayingItem: mpNowPlayingItem, playing } = mediaPlayer
    
    return (
      playing
      && ((episode && removeProtocol(episode.mediaUrl) === removeProtocol(mpNowPlayingItem.episodeMediaUrl))
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

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { episode, initialShowDescription, mediaRef, nowPlayingItem, podcast, settings, t, user } = this.props
    const userId = user && user.id
    const { censorNSFWText } = settings

    return (
      <Fragment>
        <MediaInfo
          censorNSFWText={censorNSFWText === 'true' || !censorNSFWText}
          episode={episode}
          handleAddToQueueLast={() => this.addToQueue(null, true)}
          handleAddToQueueNext={() => this.addToQueue(null, false)}
          handleAddToPlaylist={() => this.toggleAddToPlaylistModal()}
          handleLinkClick={this.linkClick}
          handlePauseItem={this.pauseItem}
          handlePlayItem={() => this.playItem(this.getCurrentPageItem())}
          handleReplayClip={() => this.playItem(this.getCurrentPageItem(), false, true)}
          handleToggleEditClipModal={this.toggleEditClipModal}
          handleToggleShare={this.toggleShareModal}
          initialShowDescription={initialShowDescription}
          isOfficialChapter={mediaRef && mediaRef.isOfficialChapter}
          isOfficialSoundBite={mediaRef && mediaRef.isOfficialSoundBite}
          loggedInUserId={userId}
          mediaRef={mediaRef}
          nowPlayingItem={nowPlayingItem}
          playing={this.isCurrentlyPlayingItem()}
          podcast={podcast}
          i18n={i18n}
          Trans={Trans}
          t={t} />
        <hr />
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
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(MediaInfoCtrl))
