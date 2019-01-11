
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem } from 'podverse-ui'
import { pageIsLoading } from '~/redux/actions'
import { getPlaylistsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  myPlaylists: any[]
  pageIsLoading?: any
  subscribedPlaylists: any[]
  user: any
}

type State = {}

class Playlists extends Component<Props, State> {

  static async getInitialProps({ store }) {
    const state = store.getState()
    const { user } = state
    
    const subscribedPlaylistIds = user.subscribedPlaylistIds || []

    let myPlaylists = (user && user.playlists) || []

    let subscribedPlaylists = []
    if (subscribedPlaylistIds && subscribedPlaylistIds.length > 0) {
      const subscribedPlaylistsData = await getPlaylistsByQuery({
        from: 'subscribed-only',
        subscribedPlaylistIds
      })
      subscribedPlaylists = subscribedPlaylistsData.data
    }

    store.dispatch(pageIsLoading(false))

    return { myPlaylists, subscribedPlaylists, user }
  }

  constructor(props) {
    super(props)

    this.state = {}

    this.linkClick = this.linkClick.bind(this)
  }

  linkClick() {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { myPlaylists, subscribedPlaylists, user } = this.props
    
    const myPlaylistNodes = myPlaylists.map(x => (
        <MediaListItem
          dataPlaylist={x}
          handleLinkClick={this.linkClick}
          hasLink
          itemType='playlist'
          key={`media-list-item-${uuidv4()}`} />
    ))

    const subscribedPlaylistNodes = subscribedPlaylists.map(x => (
      <MediaListItem
        dataPlaylist={x}
        handleLinkClick={this.linkClick}
        hasLink
        itemType='playlist'
        key={`media-list-item-${uuidv4()}`}
        showOwner />
    ))

    return (
      <Fragment>
        {
          (!user || !user.id) &&
            <div className='no-results-msg'>Login to view your playlists</div>
        }
        {
          (user && user.id) &&
          <Fragment>
            <h3>My Playlists</h3>
            <div className='media-list'>
              {
                (myPlaylistNodes && myPlaylistNodes.length > 0) &&
                  myPlaylistNodes
              }
              {
                (myPlaylistNodes.length === 0) &&
                  <div className='no-results-msg'>No playlists found</div>
              }
            </div>
            {
              (subscribedPlaylistNodes && subscribedPlaylistNodes.length > 0) &&
                <Fragment>
                  <h3>Subscribed Playlists</h3>
                  <div className='media-list'>
                    {subscribedPlaylistNodes}
                  </div>
                </Fragment>
            }
          </Fragment>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
