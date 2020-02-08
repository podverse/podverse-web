
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaInfo, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, modalsAddToShow,
  modalsMakeClipShow, modalsShareShow, pageIsLoading, pagesSetQueryState, playerQueueLoadPriorityItems,
  userSetInfo } from '~/redux/actions'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { addOrUpdateHistoryItemPlaybackPosition, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  getViewContentsElementScrollTop } from '~/lib/utility'
import { updateUserQueueItems } from '~/services'

type Props = {
  episode?: any
  initialShowDescription?: boolean
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
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
  showDescription?: boolean
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaInfoCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  playItem = async (nowPlayingItem, loadOnly = false) => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, user,
      userSetInfo } = this.props

    const currentTime = Math.floor(window.player.getCurrentTime()) || 0
    await addOrUpdateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user, currentTime)
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
      if (user && user.id) {
        await addOrUpdateHistoryItemPlaybackPosition(nowPlayingItem, user)
  
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
      } else if (episode) {
        isLast ? user.queueItems.push(convertToNowPlayingItem(episode)) : user.queueItems.unshift(convertToNowPlayingItem(episode))
      } else if (mediaRef) {
        isLast ? user.queueItems.push(convertToNowPlayingItem(mediaRef)) : user.queueItems.unshift(convertToNowPlayingItem(mediaRef))
      }

      const response = await updateUserQueueItems({ queueItems: user.queueItems })

      priorityItems = response.data || []
    } else {
      if (nowPlayingItem && nowPlayingItem.episodeMediaUrl) {
        addItemToPriorityQueueStorage(nowPlayingItem, isLast)
      } else if (episode) {
        addItemToPriorityQueueStorage(convertToNowPlayingItem(episode))
      } else if (mediaRef) {
        addItemToPriorityQueueStorage(convertToNowPlayingItem(mediaRef))
      }

      priorityItems = getPriorityQueueItemsStorage()
    }

    playerQueueLoadPriorityItems(priorityItems)
  }

  toggleAddToModal = (showQueue = true) => {
    const { modals, modalsAddToShow } = this.props
    const { addTo } = modals
    const { isOpen } = addTo

    modalsAddToShow({
      isOpen: !isOpen,
      nowPlayingItem: this.getCurrentPageItem(),
      showQueue
    })
  }

  toggleEditClipModal = () => {
    const { modals, modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { isOpen } = makeClip

    if (!this.isCurrentlyPlayingItem()) {
      this.playItem(this.getCurrentPageItem(), true)
    }

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

    const clipLinkAs = nowPlayingItem.clipId ? `${window.location.host}/clip/${nowPlayingItem.clipId}` : ''
    const episodeLinkAs = `${window.location.host}/episode/${nowPlayingItem.episodeId}`

    modalsShareShow({
      clipLinkAs,
      episodeLinkAs,
      isOpen: !isOpen
    })
  }

  getCurrentPageItem = () => {
    const { episode, mediaRef, nowPlayingItem } = this.props

    if (episode) {
      return convertToNowPlayingItem(episode)
    } else if (mediaRef) {
      return convertToNowPlayingItem(mediaRef)
    } else if (nowPlayingItem) {
      return nowPlayingItem
    }
  }

  isCurrentlyPlayingItem = () => {
    const { episode, mediaRef, mediaPlayer, nowPlayingItem } = this.props
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
    const { episode, initialShowDescription, mediaRef, nowPlayingItem, podcast, user } = this.props
    const userId = user && user.id

    return (
      <MediaInfo
        episode={episode}
        handleAddToQueueLast={() => this.addToQueue(null, true)}
        handleAddToQueueNext={() => this.addToQueue(null, false)}
        handleLinkClick={this.linkClick}
        handlePauseItem={this.pauseItem}
        handlePlayItem={() => this.playItem(this.getCurrentPageItem())}
        handleToggleAddToModal={this.toggleAddToModal}
        handleToggleEditClipModal={this.toggleEditClipModal}
        handleToggleMakeClipModal={this.toggleMakeClipModal}
        handleToggleShareModal={this.toggleShareModal}
        initialShowDescription={initialShowDescription}
        loggedInUserId={userId}
        mediaRef={mediaRef}
        nowPlayingItem={nowPlayingItem}
        playing={this.isCurrentlyPlayingItem()}
        podcast={podcast} />
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaInfoCtrl)
