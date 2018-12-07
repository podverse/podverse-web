
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaListItem } from 'podverse-ui'
import { pageIsLoading } from '~/redux/actions'
const uuidv4 = require('uuid/v4')

type Props = {
  playlists: any[]
  user: any
}

type State = {}

class Playlists extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state
    const playlists = user.playlists || []

    store.dispatch(pageIsLoading(false))

    return { playlists, user }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { playlists, user } = this.props

    const mediaListItemNodes = playlists.map(x => (
        <MediaListItem
          dataPlaylist={x}
          hasLink
          itemType='playlist'
          key={`media-list-item-${uuidv4()}`} />
      )
    )

    return (
      <Fragment>
        <h3>Playlists</h3>
          <div className='media-list'>
          {
            (user && user.id) && 
              <Fragment>
                {
                  (mediaListItemNodes && mediaListItemNodes.length > 0) &&
                    mediaListItemNodes
                }
                {
                  (mediaListItemNodes.length === 0) &&
                    <div className='no-results-msg'>No playlists found.</div>
                }
              </Fragment>
          }
          {
            (!user || !user.id) &&
              <div className='no-results-msg'>Login to view your playlists.</div>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
