import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { pageIsLoading, playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getPodcastsByQuery, getPublicUser, getUserMediaRefs, getUserPlaylists } from '~/services'

type Props = {
  currentId?: string
  listItems?: any[]
  publicUser?: any
  queryPage?: number
  querySort?: string
  queryType?: string
  user?: any
}

type State = {}

class PublicProfile extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { settings } = state
    const { nsfwMode } = settings
    const currentId = query.id

    const response = await getPublicUser(currentId)
    const publicUser = response.data
    let dataResult
    let listItems = []
    if (query.type === 'clips') {
      dataResult = await getUserMediaRefs(currentId, nsfwMode)
      listItems = dataResult.data.map(x => convertToNowPlayingItem(x))
      store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    } else if (query.type === 'playlists') {
      dataResult = await getUserPlaylists(currentId)
      listItems = dataResult.data
    } else {
      dataResult = await getPodcastsByQuery({
        from: 'subscribed-only',
        subscribedPodcastIds: publicUser.subscribedPodcastIds
      }, nsfwMode)
      listItems = dataResult.data
    }

    store.dispatch(pageIsLoading(false))

    return { currentId, listItems, publicUser }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { currentId, listItems, publicUser, queryPage, querySort, queryType,
      user } = this.props
    
    return (
      <div className='user-profile'>
        <Meta />
        {
          !publicUser &&
            <h3>Page not found</h3>
        }
        {
          publicUser &&
            <Fragment>
              <UserHeaderCtrl 
                loggedInUser={user}
                profileUser={publicUser} />
              <UserMediaListCtrl
                currentId={currentId}
                listItems={listItems}
                loggedInUser={user}
                queryPage={queryPage || 1}
                querySort={querySort || 'top-past-week'}
                queryType={queryType || 'podcasts'}
                profileUser={publicUser} />
            </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfile)
