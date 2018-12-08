
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { PVButton as Button } from 'podverse-ui'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, readableDate } from '~/lib/utility'
import { pageIsLoading, playerQueueLoadSecondaryItems, userSetInfo } from '~/redux/actions'
import { getPlaylistById, toggleSubscribeToPlaylist, addOrRemovePlaylistItem } from '~/services/'

const uuidv4 = require('uuid/v4')

type Props = {
  mediaPlayer: any
  playerQueueLoadSecondaryItems: any
  playlist: any
  playlistItems: any[]
  user: any
  userSetInfo: any
}

type State = {
  isEditing?: boolean
  isLoading?: boolean
  isSubscribed?: boolean
  isSubscribing?: boolean
  isUpdating?: boolean
  newDescription?: string
  newTitle?: string
  sortedNowPlayingItems: any[]
}

class Playlists extends Component<Props, State> {

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
      sortedNowPlayingItems: []
    }

    this.handleTitleInputChange = this.handleTitleInputChange.bind(this)
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this)
    this.cancelEditing = this.cancelEditing.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.startEditing = this.startEditing.bind(this)
    this.toggleSubscribe = this.toggleSubscribe.bind(this)
    this.updatePlaylist = this.updatePlaylist.bind(this)
  }

  componentDidMount() {
    const { mediaPlayer, playerQueueLoadSecondaryItems, playlist, playlistItems } = this.props
    const { nowPlayingItem } = mediaPlayer
    const itemsOrder = playlist.itemsOrder

    let sortedPlaylistItems = itemsOrder.map(id => {
      let items = playlistItems.filter(y => y.id === id)
      if (items.length > 0) {
        let index = playlistItems.indexOf(items[0])
        playlistItems.splice(index, 1)
        return items[0]
      }
    })

    const sortedNowPlayingItems = sortedPlaylistItems.concat(playlistItems).map(
      x => convertToNowPlayingItem(x)
    )

    let nowPlayingItemIndex = sortedNowPlayingItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    let queuedListItems = clone(sortedNowPlayingItems)
    nowPlayingItemIndex > 0 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
    
    playerQueueLoadSecondaryItems(queuedListItems)

    this.setState({
      isLoading: false,
      sortedNowPlayingItems
    })
  }

  startEditing() {
    const { playlist } = this.props
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

  updatePlaylist() {
    this.setState({ isUpdating: true })
  }

  async toggleSubscribe() {
    const { playlist, user, userSetInfo } = this.props

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

  render() {
    const { mediaPlayer, playlist, user } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { owner, title } = playlist
    const { description, itemCount, updatedAt: lastUpdated } = playlist
    const { subscribedPlaylistIds } = user
    const isSubscribed = subscribedPlaylistIds && subscribedPlaylistIds.includes(playlist.id)
    const { isEditing, isLoading, isSubscribing, isUpdating, newDescription, 
      newTitle, sortedNowPlayingItems } = this.state
  
    const listItemNodes = sortedNowPlayingItems.map(x => {
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

      return (
        <MediaListItemCtrl
          handleRemoveItem={() => this.removeItem(playlist.id, x.clipId, x.episodeId)}
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType='now-playing-item'
          nowPlayingItem={x}
          showMoreMenu={!isEditing}
          showRemove={isEditing} />
      )
    })

    return (
      <Fragment>
        <h3>Playlist</h3>
        <div className='media-header'>
          <div className='text-wrapper'>
            {
              !isEditing &&
                <Fragment>
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
                  {
                    (user && user.id) &&
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
                  itemCount &&
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
                className='playlist-edit-btns__cancel'
                onClick={this.cancelEditing}
                text='Cancel' />
              <Button
                className='playlist-edit-btns__update'
                color='primary'
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
              listItemNodes
          }
          {
            (listItemNodes.length === 0) &&
            <div className='no-results-msg'>No playlist items found.</div>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
