import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AddToModal, MakeClipModal, QueueModal, ShareModal,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { mediaPlayerUpdatePlaying, modalsAddToShow, modalsMakeClipShow,
  modalsQueueShow, modalsShareShow, modalsMakeClipIsLoading,
  playerQueueLoadPriorityItems } from '~/redux/actions'
import { createMediaRef } from '~/services/mediaRef'

type Props = {
  mediaPlayer?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToShow?: any
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

  makeClipSave = async data => {
    const { mediaPlayer, modalsMakeClipIsLoading } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { description, episodeDuration, episodeGuid, episodeId, episodeImageUrl,
      episodeLinkUrl, episodeMediaUrl, episodePubDate, episodeSummary, episodeTitle,
      podcastFeedUrl, podcastGuid, podcastId, podcastImageUrl } = nowPlayingItem

    data = {
      ...data,
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
      ...(description ? { description } : {})
    }

    try {
      modalsMakeClipIsLoading(true)
      await createMediaRef(data)
    } catch (error) {
      console.log(error)
    } finally {
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
    const { addTo, makeClip, queue, share } = modals
    const { isOpen: addToIsOpen, nowPlayingItem: addToNowPlayingItem,
      showQueue: addToShowQueue } = addTo
    const { isLoading: makeClipIsLoading, isOpen: makeClipIsOpen } = makeClip
    const { isOpen: queueIsOpen } = queue
    const { clipLinkAs, episodeLinkAs, isOpen: shareIsOpen, podcastLinkAs 
      } = share
    const { priorityItems, secondaryItems } = playerQueue
    const { isLoggedIn } = user

    let currentTime = 0
    if (typeof window !== 'undefined' && window.player) {
      currentTime = window.player.getCurrentTime()
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
          handleEndTimePreview={this.makeClipEndTimePreview}
          handleHideModal={this.hideMakeClipModal}
          handleSave={this.makeClipSave}
          handleStartTimePreview={this.makeClipStartTimePreview}
          isLoading={makeClipIsLoading}
          isOpen={makeClipIsOpen}
          isPublic={true}
          player={typeof window !== 'undefined' && window.player}
          startTime={currentTime} />
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
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsMakeClipIsLoading: bindActionCreators(modalsMakeClipIsLoading, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaModals)
