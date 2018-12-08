
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Router from 'next/router'
import { Input } from 'reactstrap'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { PVButton as Button } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, readableDate } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying, pageIsLoading,
  playerQueueLoadSecondaryItems, userSetInfo } from '~/redux/actions'
import { addOrRemovePlaylistItem, addOrUpdateUserHistoryItem, deletePlaylist,
  getPlaylistById, toggleSubscribeToPlaylist, updatePlaylist } from '~/services/'

const uuidv4 = require('uuid/v4')

type Props = {
  mediaPlayer: any
  mediaPlayerLoadNowPlayingItem: any
  mediaPlayerUpdatePlaying: any
  pageIsLoading: any
  playerQueueLoadSecondaryItems: any
  playlist: any
  playlistItems: any[]
  user: any
  userSetInfo: any
  sortedNowPlayingItems
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

class Playlist extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state
    const playlistResult = await getPlaylistById(query.id) || {}
    const playlist = playlistResult.data || {}
    const episodes = playlist.episodes || []
    const mediaRefs = playlist.mediaRefs || []
    
    let playlistItems = episodes.concat(mediaRefs)

    store.dispatch(pageIsLoading(false))
    
    return { playlist, playlistItems, user }
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
    this.cancelEditing = this.cancelEditing.bind(this)
    this.deletePlaylist = this.deletePlaylist.bind(this)
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this)
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.playItem = this.playItem.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.startEditing = this.startEditing.bind(this)
    this.toggleSubscribe = this.toggleSubscribe.bind(this)
    this.updatePlaylist = this.updatePlaylist.bind(this)
  }

  componentDidMount() {
    const { mediaPlayer, playerQueueLoadSecondaryItems, playlistItems } = this.props
    const { nowPlayingItem } = mediaPlayer
    const { playlist } = this.state
    const itemsOrder = playlist.itemsOrder

    const sortedPlaylistItems = itemsOrder.map(id => {
      let items = playlistItems.filter(y => y.id === id)
      if (items.length > 0) {
        let index = playlistItems.indexOf(items[0])
        playlistItems.splice(index, 1)
        return items[0]
      }
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

    let nowPlayingItemIndex = sortedNowPlayingItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    let queuedListItems = clone(sortedNowPlayingItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
    
    playerQueueLoadSecondaryItems(queuedListItems)

    this.setState({
      isLoading: false,
      sortedNowPlayingItems
    })
  }

  startEditing() {
    const { playlist } = this.state
    const { description, title } = playlist

    this.setState({ 
      isEditing: true,
      newDescription: description,
      newTitle: title
    })
  }

  cancelEditing() {
    this.setState({ isEditing: false })
  }

  async deletePlaylist() {
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
      alert('Delete playlist failed. Please check your internet connection and try again.')
    }
  }

  async updatePlaylist() {
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
      console.log(error)
      this.setState({ isUpdating: false })
      alert('Update playlist failed. Please check your internet connection and try again.')
    }

  }

  async toggleSubscribe() {
    const { user, userSetInfo } = this.props
    const { playlist } = this.state

    if (!user || !user.id) {
      alert('Login to subscribe to playlists.')
      return
    }

    this.setState({ isSubscribing: true })

    const response = await toggleSubscribeToPlaylist(playlist.id)

    if (response) {
      userSetInfo({ subscribedPlaylistIds: response.data })
    }

    this.setState({ isSubscribing: false })
  }

  handleTitleInputChange(event) {
    const { value: newTitle } = event.target
    this.setState({ newTitle })
  }

  handleDescriptionInputChange(event) {
    const { value: newDescription } = event.target
    this.setState({ newDescription })
  }

  async removeItem(playlistId, mediaRefId, episodeId) {
    const { user, userSetInfo } = this.props
    const { sortedNowPlayingItems } = this.state

    try {
      let requestData = {
        ...(episodeId ? {episodeId} : []),
        ...(mediaRefId ? {mediaRefId} : []),
        playlistId
      }
      const res = await addOrRemovePlaylistItem(requestData)
      const { data } = res

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
          const newItems = sortedNowPlayingItems.filter(x => x.clipId != mediaRefId)
          this.setState({ sortedNowPlayingItems: newItems })
        } else if (episodeId) {
          const newItems = sortedNowPlayingItems.filter(x => x.episodeId != episodeId)
          this.setState({ sortedNowPlayingItems: newItems })
        }
      }
    } catch (error) {
      console.log(error)
      alert('Could not remove from playlist. Please check your internet connection and try again.')
    }
  }

  async onDragEnd(data) {
    let { playerQueueLoadSecondaryItems } = this.props
    let { playlist, sortedNowPlayingItems } = this.state
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

  async playItem(nowPlayingItem) {
    const { mediaPlayerLoadNowPlayingItem, mediaPlayerUpdatePlaying,
      playerQueueLoadSecondaryItems, user, userSetInfo } = this.props
    const { sortedNowPlayingItems } = this.state

    mediaPlayerLoadNowPlayingItem(nowPlayingItem)
    mediaPlayerUpdatePlaying(true)

    let nowPlayingItemIndex = sortedNowPlayingItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    let queuedListItems = clone(sortedNowPlayingItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
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
      })

      historyItems.push(nowPlayingItem)

      userSetInfo({ historyItems })
    }
  }

  render() {
    const { mediaPlayer, user } = this.props
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

      let listItemNode = (
        <MediaListItemCtrl
          handlePlayItem={this.playItem}
          handleRemoveItem={() => this.removeItem(playlist.id, x.clipId, x.episodeId)}
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType='now-playing-item'
          nowPlayingItem={x}
          showMoreMenu={!isEditing}
          showRemove={isEditing} />
      )

      if (user && user.id && user.id === playlist.owner.id) {
        return (
          <Draggable draggableId={`playlist-item-${index}`} index={index}>
            {(provided, snapshot) => (
              <div
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
        <h3>Playlist</h3>
        <div className='media-header'>
          <div className='text-wrapper'>
            {
              !isEditing &&
                <Fragment>
                  {
                    (!user.id || (user && user.id && user.id !== playlist.owner.id)) &&
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
                                  // @ts-ignore
                                  : <FontAwesomeIcon icon={farStar} />
                              }
                            </React.Fragment>
                        }
                      </button>
                  }
                  {
                    (user && user.id && user.id === playlist.owner.id) &&
                      <button
                        className='media-header__edit'
                        onClick={this.startEditing}>
                        <FontAwesomeIcon icon='edit' />
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
            {
              !isEditing &&
                <Fragment>
                  <div className='media-header__title'>
                    {title ? title : 'Untitled Playlist'}
                  </div>
                  <div className='media-header__sub-title'>
                    By: {owner.name ? owner.name : 'anonymous'}
                  </div>
                </Fragment>
            }
          </div>
        </div>
        <div className='media-info'>
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
            isLoading &&
              <FontAwesomeIcon icon='spinner' spin />
          }
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
            (listItemNodes.length === 0) &&
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
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
