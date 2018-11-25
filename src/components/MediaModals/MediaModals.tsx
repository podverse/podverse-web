import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AddToModal, ClipCreatedModal, MakeClipModal, QueueModal, ShareModal,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { currentPageLoadMediaRef, mediaPlayerUpdatePlaying, modalsAddToShow,
  modalsClipCreatedShow, modalsMakeClipShow, modalsQueueShow, modalsShareShow,
  modalsMakeClipIsLoading, playerQueueLoadPriorityItems } from '~/redux/actions'
import { createMediaRef, updateMediaRef } from '~/services/mediaRef'

type Props = {
  currentPageLoadMediaRef?: any
  mediaPlayer?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
  modalsClipCreatedShow?: any
  modalsMakeClipIsLoading?: any
  modalsMakeClipShow?: any
  modalsQueueShow?: any
  modalsShareShow?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
  user?: any
}

type State = {
  autoplay?: boolean
  makeClipIsLoading?: boolean
  playbackRate?: number
}

class MediaModals extends Component<Props, State> {

  addToQueue(isLast) {
    const { modals, playerQueueLoadPriorityItems } = this.props
    const { addTo } = modals
    const { nowPlayingItem } = addTo

    addItemToPriorityQueueStorage(nowPlayingItem, isLast)

    const priorityItems = getPriorityQueueItemsStorage()
    playerQueueLoadPriorityItems(priorityItems)
  }

  hideAddToModal = () => {
    const { modalsAddToShow } = this.props
    modalsAddToShow(false)
  }

  hideClipCreatedModal = () => {
    const { modalsClipCreatedShow } = this.props
    modalsClipCreatedShow(null)
  }

  hideMakeClipModal = () => {
    const { modalsMakeClipShow } = this.props
    modalsMakeClipShow(false)
  }

  hideQueueModal = () => {
    const { modalsQueueShow } = this.props
    modalsQueueShow(false)
  }

  hideShareModal = () => {
    const { modalsShareShow } = this.props
    modalsShareShow(false)
  }

  makeClipEndTimePreview = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(true)

    setTimeout(() => {
      mediaPlayerUpdatePlaying(false)
    }, 3000)
  }

  makeClipStartTimePreview = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(true)
  }

  makeClipSave = async (data, isEditing) => {
    const { currentPageLoadMediaRef, mediaPlayer, modalsClipCreatedShow,
      modalsMakeClipIsLoading } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { clipId, description, episodeDuration, episodeGuid, episodeId, episodeImageUrl,
      episodeLinkUrl, episodeMediaUrl, episodePubDate, episodeSummary, episodeTitle,
      podcastFeedUrl, podcastGuid, podcastId, podcastImageUrl, podcastTitle } = nowPlayingItem
    
    data = {
      ...data,
      ...(isEditing ? { id: clipId } : {}),
      ...(description ? { description } : {}),
      ...(episodeDuration ? { episodeDuration } : {}),
      ...(episodeGuid ? { episodeGuid } : {}),
      ...(episodeId ? { episodeId } : {}),
      ...(episodeImageUrl ? { episodeImageUrl } : {}),
      ...(episodeLinkUrl ? { episodeLinkUrl } : {}),
      ...(episodeMediaUrl ? { episodeMediaUrl } : {}),
      ...(episodePubDate ? { episodePubDate } : {}),
      ...(episodeSummary ? { episodeSummary } : {}),
      ...(episodeTitle ? { episodeTitle } : {}),
      ...(podcastFeedUrl ? { podcastFeedUrl } : {}),
      ...(podcastGuid ? { podcastGuid } : {}),
      ...(podcastId ? { podcastId } : {}),
      ...(podcastImageUrl ? { podcastImageUrl } : {}),
      ...(podcastTitle ? { podcastTitle } : {}),
    }

    try {
      modalsMakeClipIsLoading(true)
      if (isEditing) {
        const updatedMediaRef = await updateMediaRef(data)
        currentPageLoadMediaRef(updatedMediaRef && updatedMediaRef.data)
        modalsMakeClipIsLoading(false)
      } else {
        const newMediaRef = await createMediaRef(data)
        modalsClipCreatedShow({
          isOpen: true,
          mediaRef: newMediaRef && newMediaRef.data
        })
      }
    } catch (error) {
      console.log(error)
      modalsMakeClipIsLoading(false)
    }
  }

  playlistItemAdd = (event) => {
    event.preventDefault()
    alert('add item to playlist')
  }

  queueItemClick = () => {
    alert('queue item clicked')
  }

  render() {
    const { mediaPlayer, modals, playerQueue, user } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { addTo, clipCreated, makeClip, queue, share } = modals
    const { isOpen: addToIsOpen, nowPlayingItem: addToNowPlayingItem,
      showQueue: addToShowQueue } = addTo
    const { isOpen: clipCreatedIsOpen, mediaRef: clipCreatedMediaRef } = clipCreated
    const { isEditing: makeClipIsEditing, isLoading: makeClipIsLoading,
      isOpen: makeClipIsOpen, nowPlayingItem: makeClipNowPlayingItem } = makeClip
    const { isOpen: queueIsOpen } = queue
    const { clipLinkAs, episodeLinkAs, isOpen: shareIsOpen, podcastLinkAs 
      } = share
    const { priorityItems, secondaryItems } = playerQueue
    const { isLoggedIn } = user

    let makeClipStartTime = 0
    if (makeClipIsEditing) {
      makeClipStartTime = makeClipNowPlayingItem.clipStartTime
    } else if (typeof window !== 'undefined' && window.player) {
      makeClipStartTime = window.player.getCurrentTime()
    }

    let clipCreatedLinkHref = ''
    if (typeof location !== 'undefined' && clipCreatedMediaRef) {
      clipCreatedLinkHref = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/clip/${clipCreatedMediaRef && clipCreatedMediaRef.id}`
    }

    return (
      <Fragment>
        <QueueModal
          handleAnchorOnClick={this.queueItemClick}
          handleHideModal={this.hideQueueModal}
          isOpen={queueIsOpen}
          nowPlayingItem={nowPlayingItem}
          priorityItems={priorityItems}
          secondaryItems={secondaryItems} />
        <MakeClipModal
          endTime={makeClipIsEditing ? makeClipNowPlayingItem.clipEndTime : ''}
          handleEndTimePreview={this.makeClipEndTimePreview}
          handleHideModal={this.hideMakeClipModal}
          handleSave={this.makeClipSave}
          handleStartTimePreview={this.makeClipStartTimePreview}
          isEditing={makeClipIsEditing}
          isLoading={makeClipIsLoading}
          isOpen={makeClipIsOpen}
          isPublic={true}
          player={typeof window !== 'undefined' && window.player}
          startTime={makeClipStartTime}
          title={makeClipIsEditing ? makeClipNowPlayingItem.clipTitle : ''} />
        <ClipCreatedModal
          handleHideModal={this.hideClipCreatedModal}
          isOpen={clipCreatedIsOpen}
          linkHref={clipCreatedLinkHref} />
        <AddToModal
          handleAddToQueueLast={() => this.addToQueue(true)}
          handleAddToQueueNext={() => this.addToQueue(false)}
          handleHideModal={this.hideAddToModal}
          handlePlaylistItemAdd={this.playlistItemAdd}
          isOpen={addToIsOpen}
          nowPlayingItem={addToNowPlayingItem}
          // playlists={playlists}
          showPlaylists={isLoggedIn}
          showQueue={addToShowQueue} />
        <ShareModal
          handleHideModal={this.hideShareModal}
          isOpen={shareIsOpen}
          playerClipLinkHref={clipLinkAs}
          playerEpisodeLinkHref={episodeLinkAs}
          playerPodcastLinkHref={podcastLinkAs} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadMediaRef: bindActionCreators(currentPageLoadMediaRef, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsClipCreatedShow: bindActionCreators(modalsClipCreatedShow, dispatch),
  modalsMakeClipIsLoading: bindActionCreators(modalsMakeClipIsLoading, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaModals)
