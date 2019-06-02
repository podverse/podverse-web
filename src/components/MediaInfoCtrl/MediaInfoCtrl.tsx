
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaInfo, addItemToPriorityQueueStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage } from 'podverse-ui'
import { bindActionCreators } from 'redux';
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, modalsAddToShow,
  modalsMakeClipShow, pageIsLoading, pagesSetQueryState, playerQueueLoadPriorityItems,
  userSetInfo } from '~/redux/actions'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { assignLocalOrLoggedInNowPlayingItemPlaybackPosition } from '~/lib/utility'
import { addOrUpdateUserHistoryItem, updateUserQueueItems } from '~/services'

type Props = {
  episode?: any
  mediaPlayer?: any
  mediaPlayerLoadNowPlayingItem?: any
  mediaPlayerUpdatePlaying?: any
  mediaRef?: any
  modals?: any
  modalsAddToShow?: any
  modalsMakeClipShow?: any
  nowPlayingItem?: any
  pageIsLoading?: any
  pageKey?: string
  playerQueueLoadPriorityItems?: any
  podcast?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class MediaInfoCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  playItem = async nowPlayingItem => {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, user,
      userSetInfo } = this.props
    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    setNowPlayingItemInStorage(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    if (user && user.id) {
      await addOrUpdateUserHistoryItem(nowPlayingItem)

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

  pauseItem = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(false)
  }

  addToQueue = async (nowPlayingItem, isLast) => {
    const { episode, mediaRef, playerQueueLoadPriorityItems, user } = this.props
    
    let priorityItems = []
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

  toggleMakeClipModal = () => {
    const { modals, modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { isOpen } = makeClip

    modalsMakeClipShow({
      isEditing: true,
      isOpen: !isOpen,
      nowPlayingItem: this.getCurrentPageItem()
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

    const scrollPos = document.querySelector('.view__contents').scrollTop
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { episode, mediaRef, nowPlayingItem, podcast, user } = this.props
    let userId = user && user.id

    return (
      <MediaInfo
        episode={episode}
        handleAddToQueueLast={() => this.addToQueue(null, true)}
        handleAddToQueueNext={() => this.addToQueue(null, false)}
        handleLinkClick={this.linkClick}
        handlePauseItem={this.pauseItem}
        handlePlayItem={() => this.playItem(this.getCurrentPageItem())}
        handleToggleAddToModal={this.toggleAddToModal}
        handleToggleMakeClipModal={this.toggleMakeClipModal}
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
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaInfoCtrl)
