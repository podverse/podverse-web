import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { pageIsLoading, playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getLoggedInUserMediaRefs, getLoggedInUserPlaylists, getPodcastsByQuery
  } from '~/services'

type Props = {
  listItems?: any[]
  queryPage?: number
  querySort?: string
  queryType?: string
  user?: any
}

type State = {}

class MyProfile extends Component<Props, State> {

  static async getInitialProps({ bearerToken, query, req, store }) {
    const state = store.getState()
    const { settings, user } = state
    const { nsfwMode } = settings
    
    let dataResult
    let listItems = []
    if (query.type === 'clips') {
      dataResult = await getLoggedInUserMediaRefs(bearerToken, nsfwMode, query.page)
      listItems = dataResult.data.map(x => convertToNowPlayingItem(x))
      store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    } else if (query.type === 'playlists') {
      dataResult = await getLoggedInUserPlaylists(bearerToken, query.page)
      listItems = dataResult.data
    } else {
      dataResult = await getPodcastsByQuery({
        from: 'subscribed-only',
        subscribedPodcastIds: user.subscribedPodcastIds
      }, nsfwMode)
      listItems = dataResult.data
    }

    store.dispatch(pageIsLoading(false))

    return { listItems, user }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { listItems, queryPage, querySort, queryType, user } = this.props

    return (
      <div className='user-profile'>
        <Meta />
        {
          !user &&
          <h3>Page not found</h3>
        }
        {
          user &&
          <Fragment>
            <UserHeaderCtrl
              loggedInUser={user}
              profileUser={user} />
            <UserMediaListCtrl
              isMyProfilePage={true}
              listItems={listItems}
              loggedInUser={user}
              queryPage={queryPage || 1}
              querySort={querySort || 'top-past-week'}
              queryType={queryType || 'podcasts'}
              profileUser={user} />
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)
