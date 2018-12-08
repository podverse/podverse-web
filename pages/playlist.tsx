
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import MediaListItemCtrl from '~/components/MediaListItemCtrl/MediaListItemCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, readableDate } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading, playerQueueLoadSecondaryItems,
  userSetInfo } from '~/redux/actions'
import { getPlaylistById, toggleSubscribeToPlaylist } from '~/services/'
import { bindActionCreators } from 'redux'

const uuidv4 = require('uuid/v4')

type Props = {
  mediaPlayer: any
  mediaPlayerLoadNowPlayingItem: any
  playerQueueLoadSecondaryItems: any
  playlist: any
  playlistItems: any[]
  user: any
  userSetInfo: any
}

type State = {
  isLoading?: boolean
  isSubscribed?: boolean
  isSubscribing?: boolean
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

    this.toggleSubscribe = this.toggleSubscribe.bind(this)
  }

  componentDidMount() {
    const { mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems, playlist,
      playlistItems } = this.props
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

    // @ts-ignore
    if (sortedNowPlayingItems.length > 0) {
      mediaPlayerLoadNowPlayingItem(sortedNowPlayingItems[0])
    }
    
    playerQueueLoadSecondaryItems(clone(sortedNowPlayingItems))

    this.setState({
      isLoading: false,
      sortedNowPlayingItems
    })
  }

  toggleEdit() {
    console.log('edit')
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

  render() {
    const { mediaPlayer, playlist, user } = this.props
    const { nowPlayingItem: mpNowPlayingItem } = mediaPlayer
    const { owner, title } = playlist
    const { description, itemCount, updatedAt: lastUpdated } = playlist
    const { subscribedPlaylistIds } = user
    const isSubscribed = subscribedPlaylistIds && subscribedPlaylistIds.includes(playlist.id)
    const { isLoading, isSubscribing, sortedNowPlayingItems } = this.state

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
          key={`media-list-item-${uuidv4()}`}
          isActive={isActive()}
          mediaListItemType='now-playing-item'
          nowPlayingItem={convertToNowPlayingItem(x)} />
      )
    })

    return (
      <Fragment>
        <h3>Playlist</h3>
        <div className='media-header'>
          <div className='text-wrapper'>
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
            <button
              className='media-header__edit'
              onClick={this.toggleEdit}>
              <FontAwesomeIcon icon='edit' />
            </button>
            <a className='media-header__title'>
              {title ? title : 'Untitled Playlist'}
            </a>
            <a className='media-header__sub-title'>
              By: {owner.name ? owner.name : 'anonymous'}
            </a>
          </div>
        </div>
        <div className='media-info'>
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
          {
            description &&
            <div className='media-info__description'>
              {description}
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
  mediaPlayerLoadNowPlayingItem: bindActionCreators(mediaPlayerLoadNowPlayingItem, dispatch),
  playerQueueLoadSecondaryItems: bindActionCreators(playerQueueLoadSecondaryItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
