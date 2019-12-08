
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from 'next/error'
import Router from 'next/router'
import { Input } from 'reactstrap'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { Button, setNowPlayingItemInStorage } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { alertPremiumRequired, alertRateLimitError, alertSomethingWentWrong, assignLocalOrLoggedInNowPlayingItemPlaybackPosition,
  clone, getUrlFromRequestOrWindow, readableDate, removeDoubleQuotes, updateHistoryItemPlaybackPosition } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading,
  pagesSetQueryState, playerQueueLoadSecondaryItems, userSetInfo } from '~/redux/actions'
import { addOrRemovePlaylistItem, addOrUpdateUserHistoryItem, deletePlaylist,
  getPlaylistById, toggleSubscribeToPlaylist, updatePlaylist } from '~/services/'

const uuidv4 = require('uuid/v4')

type Props = {
  is404Page?: boolean
  lastScrollPosition?: number
  mediaPlayer: any
  mediaPlayerLoadNowPlayingItem: any
  mediaPlayerUpdatePlaying: any
  meta?: any
  pageIsLoading: any
  pageKey?: string
  playerQueueLoadSecondaryItems: any
  playlist: any
  playlistItems: any[]
  sortedNowPlayingItems
  user: any
  userSetInfo: any
}

type State = {
  isDeleting?: boolean
  isEditing?: boolean
  isLoading?: boolean
  isSubscribed?: boolean
  isSubscribing?: boolean
  isUpdating?: boolean
  newDescription?: string
  newTitle?: string
  playlist: any
  playlistItemsOrder?: any[]
  sortedNowPlayingItems: any[]
}

interface Playlist {
  inputDescription: any
  inputTitle: any
}

const kPageKey = 'playlist_'

class Playlist extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings
    const playlistResult = await getPlaylistById(query.id, nsfwMode) || {}
    const playlist = playlistResult.data

    if (!playlist) {
      store.dispatch(pageIsLoading(false))
      return { is404Page: true }
    }

    const episodes = playlist.episodes || []
    const mediaRefs = playlist.mediaRefs || []
    
    const playlistItems = episodes.concat(mediaRefs)

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))
    
    let meta = {}
    if (playlist) {
      meta = {
        currentUrl: getUrlFromRequestOrWindow(req),
        description: removeDoubleQuotes(`${playlist.title ? playlist.title : 'Untitled Playlist'} - playlist on Podverse ${playlist.description ? playlist.description : ''}`),
        title: `${playlist.title ? playlist.title : 'Untitled Playlist'}`
      }
    }

    return { lastScrollPosition, meta, pageKey: pageKeyWithId, playlist, playlistItems, user }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      playlist: props.playlist,
      playlistItemsOrder: [], 
      sortedNowPlayingItems: []
    }

    this.inputTitle = React.createRef()
    this.inputDescription = React.createRef()
  }

  componentDidMount() {
    const {is404Page, mediaPlayer, playerQueueLoadSecondaryItems, playlistItems } = this.props
    
    if (is404Page) return

    const { nowPlayingItem } = mediaPlayer
    const { playlist } = this.state
    const itemsOrder = playlist.itemsOrder

    const sortedPlaylistItems = itemsOrder.map(id => {
      const items = playlistItems.filter(y => y.id === id)
      if (items.length > 0) {
        const index = playlistItems.indexOf(items[0])
        playlistItems.splice(index, 1)
        return items[0]
      }
      return {}
    })

    let sortedNowPlayingItems = sortedPlaylistItems.concat(playlistItems).map(
      x => convertToNowPlayingItem(x)
    )

    sortedNowPlayingItems = sortedNowPlayingItems.reduce((result, x) => {
      if (!!x && Object.keys(x).length > 0) {
        result.push(x)
      }
      return result
    }, [])

    const nowPlayingItemIndex = sortedNowPlayingItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    const queuedListItems = clone(sortedNowPlayingItems)

    if (nowPlayingItemIndex > -1) {
      queuedListItems.splice(0, nowPlayingItemIndex + 1)
    }
    
    playerQueueLoadSecondaryItems(queuedListItems)

    this.setState({
      isLoading: false,
      sortedNowPlayingItems
    })
  }

  startEditing = () => {
    const { playlist } = this.state
    const { description, title } = playlist

    this.setState({ 
      isEditing: true,
      newDescription: description,
      newTitle: title
    })
  }

  cancelEditing = () => {
    this.setState({ isEditing: false })
  }

  deletePlaylist = async () => {
    this.setState({ isDeleting: true })

    const { pageIsLoading, user, userSetInfo } = this.props
    const { playlists } = user
    const { playlist } = this.state

    try {
      await deletePlaylist(playlist.id)
      
      const newPlaylists = playlists.reduce((result, x) => {
        if (x.id !== playlist.id) {
          result.push(x)
        }
        return result
      }, [])

      this.setState({
        isDeleting: false,
        isEditing: false,
        playlist: {}
      })
      pageIsLoading(true)
      userSetInfo({ playlists: newPlaylists })

      const href = `/playlists`
      const as = `/playlists`
      Router.push(href, as)
    } catch (error) {
      console.log(error)
      this.setState({ isDeleting: false })
      alert('Delete playlist failed. Please check your internet connection and try again later.')
    }
  }

  updatePlaylist = async () => {
    this.setState({ isUpdating: true })

    const { playlist } = this.state
    const { value: description } = this.inputDescription.current
    const { value: title } = this.inputTitle.current
    
    try {
      const updatedPlaylist = await updatePlaylist({
        description,
        id: playlist.id,
        title
      })

      this.setState({
        isEditing: false,
        isUpdating: false,
        playlist: updatedPlaylist.data
      })
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alert('Update playlist failed. Please check your internet connection and try again later.')
      }
      this.setState({ isUpdating: false })
      console.log(error)
    }

  }

  toggleSubscribe = async () => {
    const { user, userSetInfo } = this.props
    const { playlist } = this.state

    if (!user || !user.id) {
      alert('Login to subscribe to playlists.')
      return
    }

    this.setState({ isSubscribing: true })

    try {
      const response = await toggleSubscribeToPlaylist(playlist.id)
  
      if (response) {
        userSetInfo({ subscribedPlaylistIds: response.data })
      }
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === 'Premium Membership Required') {
        alertPremiumRequired()
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong()
      }
    }

    this.setState({ isSubscribing: false })
  }

  handleTitleInputChange = event => {
    const { value: newTitle } = event.target
    this.setState({ newTitle })
  }

  handleDescriptionInputChange = event => {
    const { value: newDescription } = event.target
    this.setState({ newDescription })
  }

  removeItem = async (playlistId, mediaRefId, episodeId) => {
    const { user, userSetInfo } = this.props
    const { sortedNowPlayingItems } = this.state

    try {
      const requestData = {
        ...(episodeId ? {episodeId} : []),
        ...(mediaRefId ? {mediaRefId} : []),
        playlistId
      }
      const res = await addOrRemovePlaylistItem(requestData)
      const data = res[0]

      if (data) {
        userSetInfo({
          playlists: user.playlists.map(x => {
            if (x.id === playlistId) {
              x.itemCount = data.playlistItemCount
            }
            return x
          })
        })

        if (mediaRefId) {
          const newItems = sortedNowPlayingItems.filter(x => x.clipId !== mediaRefId)
          this.setState({ sortedNowPlayingItems: newItems })
        } else if (episodeId) {
          const newItems = sortedNowPlayingItems.filter(x => x.episodeId !== episodeId)
          this.setState({ sortedNowPlayingItems: newItems })
        }
      }
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alert('Could not remove from playlist. Please check your internet connection and try again later.')
      }
      console.log(error)
    }
  }

  onDragEnd = async data => {
    const { playerQueueLoadSecondaryItems } = this.props
    const { playlist, sortedNowPlayingItems } = this.state
    const { destination, source } = data

    let itemToMove: any = []

    if (destination && source) {
      itemToMove = sortedNowPlayingItems.splice(source.index, 1)

      if (itemToMove.length > 0) {
        sortedNowPlayingItems.splice(destination.index, 0, itemToMove[0])
      }
    }

    const itemsOrder = sortedNowPlayingItems.map(x => x.clipId || x.episodeId)

    await updatePlaylist({ 
      id: playlist.id,
      itemsOrder
    })
    
    playerQueueLoadSecondaryItems(sortedNowPlayingItems)
    this.setState({ sortedNowPlayingItems })
  }

  playItem = async nowPlayingItem => {
    const { mediaPlayer, mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { sortedNowPlayingItems } = this.state

    const currentTime = Math.floor(window.player.getCurrentTime()) || 0
    await updateHistoryItemPlaybackPosition(mediaPlayer.nowPlayingItem, user, currentTime)
    nowPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, nowPlayingItem)
    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    setNowPlayingItemInStorage(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    const nowPlayingItemIndex = sortedNowPlayingItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    const queuedListItems = clone(sortedNowPlayingItems)
    if (nowPlayingItemIndex > -1) {
      queuedListItems.splice(0, nowPlayingItemIndex + 1)
    }

    playerQueueLoadSecondaryItems(queuedListItems)

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
        return {}
      })

      historyItems.push(nowPlayingItem)

      userSetInfo({ historyItems })
    }
  }

  render() {
    const { is404Page, mediaPlayer, meta, pageKey, user } = this.props

    if (is404Page) {
      return <Error statusCode={404} />
    }

    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { subscribedPlaylistIds } = user
    const { isDeleting, isEditing, isLoading, isSubscribing, isUpdating, newDescription, 
      newTitle, playlist, sortedNowPlayingItems } = this.state
    const { owner, title } = playlist
    const { description, itemCount, updatedAt: lastUpdated } = playlist
    const isSubscribed = subscribedPlaylistIds && subscribedPlaylistIds.includes(playlist.id)
  
    const listItemNodes = sortedNowPlayingItems.map((x, index) => {
      const isActive = () => {
        if (mpNowPlayingItem) {
          if (x.clipId) {
            return x.clipId === mpNowPlayingItem.clipId
          } else if (x.episodeId) {
            return x.episodeId === mpNowPlayingItem.episodeId
          }
        }

        return false
      }

      const listItemNode = (
        <MediaListItemCtrl
          handlePlayItem={this.playItem}
          handleRemoveItem={() => this.removeItem(playlist.id, x.clipId, x.episodeId)}
          hideDescription={true}
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType='now-playing-item'
          nowPlayingItem={x}
          pageKey={pageKey}
          showMoreMenu={!isEditing}
          showRemove={isEditing} />
      )

      if (user && user.id
          && playlist && playlist.owner
          && user.id === playlist.owner.id) {
        return (
          <Draggable
            draggableId={`playlist-item-${index}`}
            index={index}
            key={`media-list-item-${uuidv4()}`}>
            {(provided, snapshot) => (
              <div
                key={`media-list-item-${uuidv4()}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                {listItemNode}
              </div>
            )}
          </Draggable>
        )
      } else {
        return listItemNode
      }
    })

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={!playlist.isPublic}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <h3>Playlist</h3>
        <div className='media-header'>
          <div className='text-wrapper'>
            <div className='media-header__top'>
              {
                !isEditing &&
                  <Fragment>
                    <div className='media-header__title'>
                      {title ? title : 'Untitled Playlist'}
                    </div>
                  </Fragment>
              }
              {
                !isEditing &&
                  <Fragment>
                    {
                      (user && user.id
                        && playlist && playlist.owner
                        && user.id === playlist.owner.id) &&
                        <button
                          className='media-header__edit'
                          onClick={this.startEditing}>
                          <FontAwesomeIcon icon='edit' />
                        </button>
                    }
                    {
                    (!user.id || (user && user.id
                      && playlist && playlist.owner
                      && user.id !== playlist.owner.id)) &&
                        <button
                          className='media-header__subscribe'
                          onClick={this.toggleSubscribe}>
                          {
                            isSubscribing ?
                              <FontAwesomeIcon icon='spinner' spin />
                              :
                              <React.Fragment>
                                {
                                  isSubscribed ?
                                    <FontAwesomeIcon icon={fasStar} />
                                    : <FontAwesomeIcon icon={farStar} />
                                }
                              </React.Fragment>
                          }
                        </button>
                    }
                  </Fragment>
              }
              {
                isEditing &&
                  <div className='media-header__title-edit'>
                    <Input
                      innerRef={this.inputTitle}
                      name='playlist__title'
                      onChange={this.handleTitleInputChange}
                      placeholder='title'
                      type='text'
                      value={newTitle} />
                  </div>
              }
            </div>
            <div className='media-header__middle'>
              <div className='media-header__sub-title'>
              {
                owner && !isEditing &&
                  <Fragment>By: {owner.name ? owner.name : 'anonymous'}</Fragment>
              }
              </div>
            </div>
          </div>
        </div>
        <div className='media-info' style={{ paddingTop: 0 }}>
          {
            !isEditing &&
              <Fragment>
                {
                  lastUpdated &&
                  <div className='media-info__last-updated'>
                    Updated: {readableDate(lastUpdated)}
                  </div>
                }
                {
                  (itemCount || itemCount === 0) &&
                  <div className='media-info__item-count'>
                    Items: {itemCount}
                  </div>
                }
              </Fragment>
          }
          {
            isEditing &&
            <div className='media-info__description-edit'>
              <Input
                innerRef={this.inputDescription}
                name='playlist__description'
                onChange={this.handleDescriptionInputChange}
                placeholder='description'
                type='textarea'
                value={newDescription} />
            </div>
          }
          {
            (!isEditing && description) &&
              <div className='media-info__description'>
                {description}
              </div>
          }
          {
            isEditing &&
            <div className='playlist-edit-btns'>
              <Button
                className='playlist-edit-btns__delete'
                disabled={isDeleting || isUpdating}
                color='danger'
                isLoading={isDeleting}
                onClick={this.deletePlaylist}
                text='Delete' />
              <Button
                className='playlist-edit-btns__cancel'
                disabled={isDeleting || isUpdating}
                onClick={this.cancelEditing}
                text='Cancel' />
              <Button
                className='playlist-edit-btns__update'
                color='primary'
                disabled={isDeleting || isUpdating}
                isLoading={isUpdating}
                onClick={this.updatePlaylist}
                text='Update' />
            </div>
          }
        </div>
        <div className='media-list'>
          {
            (listItemNodes && listItemNodes.length > 0) &&
              <Fragment>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId='playlist-items'>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'transparent' }}
                        {...provided.droppableProps}>
                        {listItemNodes}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Fragment>
          }
          {
            (!isLoading && listItemNodes.length === 0) &&
              <div className='no-results-msg'>No playlist items found</div>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  mediaPlayerUpdatePlaying: bindActionCreators(mediaPlayerUpdatePlaying, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
