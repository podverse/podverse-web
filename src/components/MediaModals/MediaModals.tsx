import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Router from 'next/router'
import { AddToModal, ClipCreatedModal, MakeClipModal, QueueModal, ShareModal,
  addItemToPriorityQueueStorage, updatePriorityQueueStorage, getPriorityQueueItemsStorage
  } from 'podverse-ui'
import { kPlaybackRate } from '~/lib/constants'
import { mediaPlayerUpdatePlaying, modalsAddToCreatePlaylistIsSaving,
  modalsAddToCreatePlaylistShow, modalsAddToShow, modalsClipCreatedShow, modalsLoginShow, 
  modalsMakeClipShow, modalsQueueShow, modalsShareShow, modalsMakeClipIsLoading,
  playerQueueLoadItems, playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { addOrRemovePlaylistItem, createMediaRef, createPlaylist, updateMediaRef, 
  updateUserQueueItems } from '~/services'

type Props = {
  mediaPlayer?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToCreatePlaylistIsSaving?: any
  modalsAddToCreatePlaylistShow?: any
  modalsAddToShow?: any
  modalsClipCreatedShow?: any
  modalsLoginShow?: any
  modalsMakeClipIsLoading?: any
  modalsMakeClipShow?: any
  modalsQueueShow?: any
  modalsShareShow?: any
  playerQueue?: any
  playerQueueLoadItems?: any
  playerQueueLoadPriorityItems?: any
  user?: any
  userSetInfo?: any
}

type State = {
  isAddedToPlayLast?: boolean
  isAddedToPlayNext?: boolean
  isAddingToPlayLast?: boolean
  isAddingToPlayNext?: boolean
}

class MediaModals extends Component<Props, State> {

  constructor(props) {
    super(props)
    
    this.state = {}

    this.queueDragEnd = this.queueDragEnd.bind(this)
  }

  async addToQueue(isLast) {
    const { mediaPlayer, playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { nowPlayingItem } = mediaPlayer

    this.setState({
      isAddedToPlayLast: false,
      isAddedToPlayNext: false,
      isAddingToPlayLast: isLast,
      isAddingToPlayNext: !isLast
    })

    let priorityItems = []
    if (user && user.id) {
      isLast ? user.queueItems.push(nowPlayingItem) : user.queueItems.unshift(nowPlayingItem)

      const response = await updateUserQueueItems({ queueItems: user.queueItems })

      priorityItems = response.data || []
    } else {
      addItemToPriorityQueueStorage(nowPlayingItem, isLast)

      priorityItems = getPriorityQueueItemsStorage()
    }

    playerQueueLoadPriorityItems(priorityItems)
    userSetInfo({ queueItems: priorityItems })

    this.setState({
      isAddedToPlayLast: isLast,
      isAddedToPlayNext: !isLast,
      isAddingToPlayLast: false,
      isAddingToPlayNext: false
    })
  }

  async queueDragEnd (priorityItems, secondaryItems) {
    const { playerQueueLoadItems, user, userSetInfo } = this.props

    if (user && user.id) {
      await updateUserQueueItems({ queueItems: priorityItems })
    } else {
      updatePriorityQueueStorage(priorityItems)
    }

    playerQueueLoadItems({
      priorityItems,
      secondaryItems
    })

    userSetInfo({ queueItems: priorityItems })
  }

  getPlaybackRateValue = () => {
    const playbackRate = localStorage.getItem(kPlaybackRate)
    return playbackRate ? JSON.parse(playbackRate) : 1
  }

  hideAddToModal = () => {
    const { modalsAddToShow } = this.props
    modalsAddToShow({})
  }

  hideClipCreatedModal = () => {
    const { modalsClipCreatedShow } = this.props
    modalsClipCreatedShow({})
  }

  hideMakeClipModal = () => {
    const { modalsMakeClipShow } = this.props
    modalsMakeClipShow({})
  }

  hideQueueModal = () => {
    const { modalsQueueShow } = this.props
    modalsQueueShow(false)
  }

  hideShareModal = () => {
    const { modalsShareShow } = this.props
    modalsShareShow({})
  }

  makeClipEndTimePreview = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(true)
    
    const playbackRate = this.getPlaybackRateValue() || 1
    let timeoutMilliseconds = 3000 / playbackRate

    setTimeout(() => {
      mediaPlayerUpdatePlaying(false)
    }, timeoutMilliseconds)
  }

  makeClipStartTimePreview = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(true)
  }

  makeClipSave = async (formData, isEditing) => {
    const { modals, modalsClipCreatedShow, modalsMakeClipIsLoading,
      modalsMakeClipShow } = this.props
    const { makeClip } = modals
    const { nowPlayingItem } = makeClip
    
    const { clipId, description, episodeDuration, episodeGuid, episodeId, episodeImageUrl,
      episodeLinkUrl, episodeMediaUrl, episodePubDate, episodeSummary, episodeTitle,
      podcastFeedUrl, podcastGuid, podcastId, podcastImageUrl, podcastTitle } = nowPlayingItem
    
    const data = {
      ...formData,
      ...isEditing && { id: clipId },
      ...description && { description },
      ...episodeDuration && { episodeDuration },
      ...episodeGuid && { episodeGuid },
      ...episodeId && { episodeId },
      ...episodeImageUrl && { episodeImageUrl },
      ...episodeLinkUrl && { episodeLinkUrl },
      ...episodeMediaUrl && { episodeMediaUrl },
      ...episodePubDate && { episodePubDate },
      ...episodeSummary && { episodeSummary },
      ...episodeTitle && { episodeTitle },
      ...podcastFeedUrl && { podcastFeedUrl },
      ...podcastGuid && { podcastGuid },
      ...podcastId && { podcastId },
      ...podcastImageUrl && { podcastImageUrl },
      ...podcastTitle && { podcastTitle }
    }

    try {
      modalsMakeClipIsLoading(true)
      if (isEditing) {
        const updatedMediaRef = await updateMediaRef(data)
        
        const href = `/clip/${updatedMediaRef.data.id}`
        const as = `/clip/${updatedMediaRef.data.id}`
        Router.push(href, as)
        
        modalsMakeClipIsLoading(false)
        modalsMakeClipShow({ isOpen: false })
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

  playlistItemAdd = async event => {
    event.preventDefault()
    const { modals, user, userSetInfo } = this.props
    const { addTo } = modals
    const { nowPlayingItem } = addTo

    this.setState({
      isAddedToPlayLast: false,
      isAddedToPlayNext: false,
      isAddingToPlayLast: false,
      isAddingToPlayNext: false
    })

    const { id: playlistId } = event.currentTarget.dataset
    
    if (playlistId) {
      const res = await addOrRemovePlaylistItem({
        playlistId,
        mediaRefId: nowPlayingItem.clipId
      })

      if (res && res.data) {
        userSetInfo({
          playlists: user.playlists.map(x => {
            if (x.id === playlistId) {
              x.itemCount = res.data.playlistItemCount
            }
            return x
          })
        })
      }
    }
  }

  createPlaylistSave = async title => {
    const { modalsAddToCreatePlaylistIsSaving, modalsAddToCreatePlaylistShow,
      user, userSetInfo } = this.props
    modalsAddToCreatePlaylistIsSaving(true)
    const result = await createPlaylist({ title })
    user.playlists.unshift(result.data)
    userSetInfo({ playlists: user.playlists })
    modalsAddToCreatePlaylistIsSaving(false)
    modalsAddToCreatePlaylistShow(false)
  }

  toggleCreatePlaylist = () => {
    const { modalsAddToCreatePlaylistShow, modals } = this.props
    const { addTo } = modals
    const { createPlaylistShow } = addTo

    modalsAddToCreatePlaylistShow(!createPlaylistShow)
  }

  hideCreatePlaylist = () => {
    const { modalsAddToCreatePlaylistShow } = this.props
    modalsAddToCreatePlaylistShow(false)
  }

  render() {
    const { mediaPlayer, modals, modalsLoginShow, playerQueue, user } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { addTo, clipCreated, makeClip, queue, share } = modals
    const { createPlaylistIsSaving, createPlaylistShowError, createPlaylistShow,
      isOpen: addToIsOpen, nowPlayingItem: addToNowPlayingItem, showQueue: addToShowQueue
      } = addTo
    const { isOpen: clipCreatedIsOpen, mediaRef: clipCreatedMediaRef } = clipCreated
    const { isEditing: makeClipIsEditing, isLoading: makeClipIsLoading,
      isOpen: makeClipIsOpen, nowPlayingItem: makeClipNowPlayingItem } = makeClip
    const { isOpen: queueIsOpen } = queue
    const { clipLinkAs, episodeLinkAs, isOpen: shareIsOpen, podcastLinkAs } = share
    const { priorityItems, secondaryItems } = playerQueue
    const { id, historyItems, playlists } = user
    const { isAddedToPlayLast, isAddedToPlayNext, isAddingToPlayLast, isAddingToPlayNext
      } = this.state

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
          // handleAnchorOnClick={this.queueItemClick}
          handleHideModal={this.hideQueueModal}
          historyItems={historyItems}
          isLoggedIn={user && !!user.id}
          isOpen={queueIsOpen}
          nowPlayingItem={nowPlayingItem}
          handleDragEnd={this.queueDragEnd}
          priorityItems={priorityItems}
          secondaryItems={secondaryItems} />
        <MakeClipModal
          endTime={makeClipIsEditing ? makeClipNowPlayingItem.clipEndTime : ''}
          handleEndTimePreview={this.makeClipEndTimePreview}
          handleHideModal={this.hideMakeClipModal}
          handleSave={this.makeClipSave}
          handleStartTimePreview={this.makeClipStartTimePreview}
          initialIsPublic={nowPlayingItem && nowPlayingItem.isPublic}
          isEditing={makeClipIsEditing}
          isLoading={makeClipIsLoading}
          isOpen={makeClipIsOpen}
          player={typeof window !== 'undefined' && window.player}
          startTime={makeClipStartTime}
          title={makeClipIsEditing ? makeClipNowPlayingItem.clipTitle : ''} />
        <ClipCreatedModal
          handleHideModal={this.hideClipCreatedModal}
          isOpen={clipCreatedIsOpen}
          linkHref={clipCreatedLinkHref} />
        <AddToModal
          createPlaylistIsSaving={createPlaylistIsSaving}
          createPlaylistError={createPlaylistShowError}
          createPlaylistShow={createPlaylistShow}
          handleAddToQueueLast={() => this.addToQueue(true)}
          handleAddToQueueNext={() => this.addToQueue(false)}
          handleCreatePlaylistHide={this.hideCreatePlaylist}
          handleCreatePlaylistSave={this.createPlaylistSave}
          handleHideModal={this.hideAddToModal}
          handleLoginClick={modalsLoginShow}
          handlePlaylistItemAdd={this.playlistItemAdd}
          handleToggleCreatePlaylist={this.toggleCreatePlaylist}
          isAddedToPlayLast={isAddedToPlayLast}
          isAddedToPlayNext={isAddedToPlayNext}
          isAddingToPlayLast={isAddingToPlayLast}
          isAddingToPlayNext={isAddingToPlayNext}
          isOpen={addToIsOpen}
          nowPlayingItem={addToNowPlayingItem}
          playlists={playlists}
          showPlaylists={!!id}
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
  modalsAddToCreatePlaylistIsSaving: bindActionCreators(modalsAddToCreatePlaylistIsSaving, dispatch),
  modalsAddToCreatePlaylistShow: bindActionCreators(modalsAddToCreatePlaylistShow, dispatch),
  modalsAddToShow: bindActionCreators(modalsAddToShow, dispatch),
  modalsClipCreatedShow: bindActionCreators(modalsClipCreatedShow, dispatch),
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  modalsMakeClipIsLoading: bindActionCreators(modalsMakeClipIsLoading, dispatch),
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  playerQueueLoadItems: bindActionCreators(playerQueueLoadItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaModals)
