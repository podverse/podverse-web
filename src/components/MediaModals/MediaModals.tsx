import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Router from 'next/router'
import { AddToModal, ClipCreatedModal, KEYS, MakeClipModal, ShareModal,
  addItemToPriorityQueueStorage, updatePriorityQueueStorage, getPriorityQueueItemsStorage,
  getSecondaryQueueItemsStorage, removeItemFromPriorityQueueStorage,
  removeItemFromSecondaryQueueStorage } from 'podverse-ui'
import { QueueModal } from '~/components/MediaModals/QueueModal'
import PV from '~/lib/constants'
import { alertPremiumRequired, alertSomethingWentWrong, clone, alertRateLimitError, safeAlert } from '~/lib/utility'
import { mediaPlayerUpdatePlaying, modalsAddToCreatePlaylistIsSaving,
  modalsAddToCreatePlaylistShow, modalsAddToShow, modalsClipCreatedShow, modalsLoginShow, 
  modalsMakeClipShow, modalsQueueShow, modalsShareShow,
  pageIsLoading, playerQueueLoadItems, playerQueueLoadPriorityItems, userSetInfo, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { addOrRemovePlaylistItem, createMediaRef, createPlaylist, deleteMediaRef,
  updateMediaRef, updateUserQueueItems } from '~/services'
import { withTranslation } from 'i18n'

type Props = {
  mediaPlayer?: any
  mediaPlayerUpdatePlaying?: any
  modals?: any
  modalsAddToCreatePlaylistIsSaving?: any
  modalsAddToCreatePlaylistShow?: any
  modalsAddToShow?: any
  modalsClipCreatedShow?: any
  modalsLoginShow?: any
  modalsMakeClipShow?: any
  modalsQueueShow?: any
  modalsShareShow?: any
  pageIsLoading?: any
  playerQueue?: any
  playerQueueLoadItems?: any
  playerQueueLoadPriorityItems?: any
  playerQueueLoadSecondaryItems?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {
  inProgressClipEndTime?: string
  inProgressClipStartTime?: string
  inProgressClipTitle?: string
  isAddedToPlayLast?: boolean
  isAddedToPlayNext?: boolean
  isAddingToPlayLast?: boolean
  isAddingToPlayNext?: boolean
  loadingItemId?: string
  makeClipIsDeleting?: boolean
  makeClipIsSaving?: boolean
}

interface MediaModals {
  makeClipInputStartTime: any
  makeClipInputEndTime: any
  makeClipInputTitle: any
}

class MediaModals extends Component<Props, State> {

  constructor(props) {
    super(props)
    
    this.state = {
      inProgressClipEndTime: '',
      inProgressClipStartTime: '',
      inProgressClipTitle: ''
    }

    this.makeClipInputStartTime = React.createRef()
    this.makeClipInputEndTime = React.createRef()
    this.makeClipInputTitle = React.createRef()
  }

  addToQueue = async isLast => {
    const { modals, playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { addTo } = modals
    const { nowPlayingItem } = addTo

    this.setState({
      isAddedToPlayLast: false,
      isAddedToPlayNext: false,
      isAddingToPlayLast: isLast,
      isAddingToPlayNext: !isLast,
      loadingItemId: ''
    })

    let priorityItems = []
    if (user && user.id) {
      user.queueItems = Array.isArray(user.queueItems) ? user.queueItems : []
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
      isAddingToPlayNext: false,
      loadingItemId: ''
    })

    setTimeout(() => {
      this.setState({ 
        isAddedToPlayLast: false,
        isAddedToPlayNext: false
      })
    }, 2500)
  }

  queueDragEnd = async (priorityItems, secondaryItems) => {
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
    try {
      const playbackRate = localStorage.getItem(PV.storageKeys.kPlaybackRate)
      return playbackRate ? JSON.parse(playbackRate) : 1
    } catch (error) {
      console.log(error)
    }
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

    const { value: startTime } = this.makeClipInputStartTime.current
    const { value: endTime } = this.makeClipInputEndTime.current
    const { value: title } = this.makeClipInputTitle.current

    window.sessionStorage.setItem(KEYS.inProgressMakeStartTimeKey, startTime)
    window.sessionStorage.setItem(KEYS.inProgressMakeEndTimeKey, endTime)
    window.sessionStorage.setItem(KEYS.inProgressMakeClipTitleKey, title)

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
    const timeoutMilliseconds = 3000 / playbackRate

    setTimeout(() => {
      mediaPlayerUpdatePlaying(false)
    }, timeoutMilliseconds)
  }

  makeClipStartTimePreview = () => {
    const { mediaPlayerUpdatePlaying } = this.props
    mediaPlayerUpdatePlaying(true)
  }

  makeClipSave = async (formData, isEditing) => {
    this.setState({ makeClipIsSaving: true })

    const { modals, modalsClipCreatedShow, modalsMakeClipShow, t } = this.props
    const { makeClip } = modals
    const { nowPlayingItem } = makeClip
    
    const { clipId, description, episodeId } = nowPlayingItem
    
    const data = {
      ...formData,
      ...isEditing && { id: clipId },
      ...description && { description },
      ...episodeId && { episodeId }
    }

    try {
      if (isEditing) {
        const updatedMediaRef = await updateMediaRef(data)
               
        this.setState({ makeClipIsSaving: false })
        modalsMakeClipShow({
          isEditing: false,
          isOpen: false
        })

        const href = `${PV.paths.web.clip}?id=${updatedMediaRef.data.id}`
        const as = `${PV.paths.web.clip}/${updatedMediaRef.data.id}`
        Router.push(href, as)
      } else {
        const newMediaRef = await createMediaRef(data)
        this.setState({ makeClipIsSaving: false })
        modalsClipCreatedShow({
          isOpen: true,
          mediaRef: newMediaRef && newMediaRef.data
        })
      }

      window.sessionStorage.removeItem(KEYS.inProgressMakeClipTitleKey)
      window.sessionStorage.removeItem(KEYS.inProgressMakeStartTimeKey)
      window.sessionStorage.removeItem(KEYS.inProgressMakeEndTimeKey)

    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === PV.errorResponseMessages.premiumRequired) {
        safeAlert(t('errorMessages:alerts.premiumRequired'))
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else if (error && error.response && error.response.status === 401) {
        alertPremiumRequired(t)
      } else {
        alertSomethingWentWrong(t)
      }
      this.setState({ makeClipIsSaving: false })
    }
  }

  makeClipDelete = async () => {
    this.setState({ makeClipIsDeleting: true })

    const { modals, modalsMakeClipShow, pageIsLoading, t } = this.props
    const { makeClip } = modals
    const { nowPlayingItem } = makeClip
    const { clipId } = nowPlayingItem

    try {
      await deleteMediaRef(clipId)

      pageIsLoading(true)

      const href = PV.paths.web.home
      const as = PV.paths.web.home
      Router.push(href, as)
    } catch (error) {
      console.log(error)
      safeAlert(t('errorMessages:alerts.deleteClipFailed'))
    }
    
    this.setState({ makeClipIsDeleting: false })
    modalsMakeClipShow({
      isEditing: false,
      isOpen: false
    })
  }

  playlistItemAdd = async event => {
    event.preventDefault()
    const { modals, t, user, userSetInfo } = this.props
    const { addTo } = modals
    const { nowPlayingItem } = addTo

    const { id: playlistId } = event.currentTarget.dataset
    
    if (playlistId) {

      this.setState({
        isAddedToPlayLast: false,
        isAddedToPlayNext: false,
        isAddingToPlayLast: false,
        isAddingToPlayNext: false,
        loadingItemId: playlistId,
      })

      try {
        const res = await addOrRemovePlaylistItem({
          playlistId,
          episodeId: nowPlayingItem.episodeId,
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
      } catch (error) {
        if (error && error.response && error.response.data && error.response.data.message === PV.errorResponseMessages.premiumRequired) {
          alertPremiumRequired(t)
        } else if (error && error.response && error.response.status === 429) {
          alertRateLimitError(error)
        } else {
          alertSomethingWentWrong(t)
        }
      }
    }

    this.setState({ loadingItemId: '' })
  }

  createPlaylistSave = async title => {
    const { modalsAddToCreatePlaylistIsSaving, modalsAddToCreatePlaylistShow, t,
      user, userSetInfo } = this.props
    modalsAddToCreatePlaylistIsSaving(true)

    try {
      const result = await createPlaylist({ title })
      user.playlists.unshift(result.data)
      userSetInfo({ playlists: user.playlists })
      modalsAddToCreatePlaylistIsSaving(false)
      modalsAddToCreatePlaylistShow(false)
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === PV.errorResponseMessages.premiumRequired) {
        alertPremiumRequired(t)
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong(t)
      }
      modalsAddToCreatePlaylistIsSaving(false)
    }
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

  queueItemClick = () => {
    this.hideQueueModal()
  }

  removeItem = async (clipId, episodeId, isPriority) => {
    const { playerQueueLoadPriorityItems, playerQueueLoadSecondaryItems, t, user,
      userSetInfo } = this.props
    const { queueItems } = user
    const localQueueItems = getPriorityQueueItemsStorage()

    let newQueueItems
    if (user && user.id) {
      newQueueItems = clone(queueItems)
    } else {
      newQueueItems = clone(localQueueItems)
    }

    if (isPriority) {
      if (clipId) {
        newQueueItems = newQueueItems.filter(x => x.clipId !== clipId)
      } else if (episodeId) {
        newQueueItems = newQueueItems.filter(x => x.episodeId !== episodeId)
      }

      if (user && user.id) {
        try {
          const response = await updateUserQueueItems({ queueItems: newQueueItems })
          const priorityItems = response.data || []
          userSetInfo({ queueItems: priorityItems })
          playerQueueLoadPriorityItems(priorityItems)
        } catch (error) {
          console.log(error)
          safeAlert(t('errorMessages:alerts.couldNotUpdateQueue'))
        }
      } else {
        removeItemFromPriorityQueueStorage(clipId, episodeId)
        const priorityItems = getPriorityQueueItemsStorage()
        userSetInfo({ queueItems: priorityItems })
        playerQueueLoadPriorityItems(priorityItems)
      }
    } else {
      removeItemFromSecondaryQueueStorage(clipId, episodeId)
      const secondaryItems = getSecondaryQueueItemsStorage()
      playerQueueLoadSecondaryItems(secondaryItems)
    }
  }

  render() {
    const { mediaPlayer, modals, modalsLoginShow, playerQueue, t, user } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { addTo, clipCreated, makeClip, queue, share } = modals
    const { createPlaylistIsSaving, createPlaylistShowError, createPlaylistShow,
      isOpen: addToIsOpen, nowPlayingItem: addToNowPlayingItem, showQueue: addToShowQueue
      } = addTo
    const { isOpen: clipCreatedIsOpen, mediaRef: clipCreatedMediaRef } = clipCreated
    const { isEditing: makeClipIsEditing, isOpen: makeClipIsOpen, 
      nowPlayingItem: makeClipNowPlayingItem } = makeClip
    const { isOpen: queueIsOpen } = queue
    const { clipLinkAs, episodeLinkAs, isOpen: shareIsOpen, podcastLinkAs } = share
    const { priorityItems, secondaryItems } = playerQueue
    const { id, historyItems, playlists } = user
    const { isAddedToPlayLast, isAddedToPlayNext, isAddingToPlayLast, 
      isAddingToPlayNext, loadingItemId, makeClipIsDeleting, makeClipIsSaving
      } = this.state
    const isLoggedIn = user && user.id

    let makeClipStartTime = 0
    if (makeClipIsEditing) {
      makeClipStartTime = makeClipNowPlayingItem.clipStartTime
    } else if (typeof window !== 'undefined' && window.player) {
      makeClipStartTime = Math.floor(window.player.getCurrentTime())
    }

    let clipCreatedLinkHref = ''
    if (typeof location !== 'undefined' && clipCreatedMediaRef) {
      clipCreatedLinkHref = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}${PV.paths.web.clip}/${clipCreatedMediaRef && clipCreatedMediaRef.id}`
    }

    return (
      <Fragment>
        <QueueModal
          handleDragEnd={this.queueDragEnd}
          handleHideModal={this.hideQueueModal}
          handleLinkClick={this.queueItemClick}
          handleRemoveItem={this.removeItem}
          historyItems={historyItems}
          isLoggedIn={user && !!user.id}
          isOpen={queueIsOpen}
          nowPlayingItem={nowPlayingItem}
          priorityItems={priorityItems}
          secondaryItems={secondaryItems}
          t={t} />
        <MakeClipModal
          endTime={makeClipIsEditing ? makeClipNowPlayingItem.clipEndTime : ''}
          handleDelete={this.makeClipDelete}
          handleEndTimePreview={this.makeClipEndTimePreview}
          handleHideModal={this.hideMakeClipModal}
          handleLoginClick={modalsLoginShow}
          handleSave={this.makeClipSave}
          handleStartTimePreview={this.makeClipStartTimePreview}
          initialIsPublic={makeClipIsEditing ? makeClipNowPlayingItem.isPublic : true}
          isDeleting={makeClipIsDeleting}
          isEditing={makeClipIsEditing}
          isLoggedIn={isLoggedIn}
          isSaving={makeClipIsSaving}
          isOpen={makeClipIsOpen}
          player={typeof window !== 'undefined' && window.player}
          refInputEndTime={this.makeClipInputEndTime}
          refInputStartTime={this.makeClipInputStartTime}
          refInputTitle={this.makeClipInputTitle}
          startTime={makeClipStartTime}
          t={t}
          title={makeClipIsEditing ? makeClipNowPlayingItem.clipTitle : ''} />
        <ClipCreatedModal
          handleHideModal={this.hideClipCreatedModal}
          isOpen={clipCreatedIsOpen}
          linkHref={clipCreatedLinkHref}
          t={t} />
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
          loadingItemId={loadingItemId}
          nowPlayingItem={addToNowPlayingItem}
          playlists={playlists}
          showPlaylists={!!id}
          showQueue={addToShowQueue}
          t={t} />
        <ShareModal
          handleHideModal={this.hideShareModal}
          isOpen={shareIsOpen}
          playerClipLinkHref={clipLinkAs}
          playerEpisodeLinkHref={episodeLinkAs}
          playerPodcastLinkHref={podcastLinkAs}
          t={t} />
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
  modalsMakeClipShow: bindActionCreators(modalsMakeClipShow, dispatch),
  modalsQueueShow: bindActionCreators(modalsQueueShow, dispatch),
  modalsShareShow: bindActionCreators(modalsShareShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  playerQueueLoadItems: bindActionCreators(playerQueueLoadItems, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(MediaModals))
