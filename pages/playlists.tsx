
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading } from '~/redux/actions'
import { getPlaylistsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  meta?: any
  myPlaylists: any[]
  pageIsLoading?: any
  subscribedPlaylists: any[]
  user: any
}

type State = {}

class Playlists extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { settings, user } = state
    const { nsfwMode } = settings
    
    const subscribedPlaylistIds = user.subscribedPlaylistIds || []

    let myPlaylists = (user && user.playlists) || []

    let subscribedPlaylists = []
    if (subscribedPlaylistIds && subscribedPlaylistIds.length > 0) {
      const subscribedPlaylistsData = await getPlaylistsByQuery({
        from: 'subscribed-only',
        subscribedPlaylistIds
      }, nsfwMode)
      subscribedPlaylists = subscribedPlaylistsData.data
    }

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Playlists on Podverse. Create playlists of podcast clips and episodes.',
      title: `Playlists`
    }

    return { meta, myPlaylists, subscribedPlaylists, user }
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
    const { meta, myPlaylists, subscribedPlaylists, user } = this.props
    
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
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
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
