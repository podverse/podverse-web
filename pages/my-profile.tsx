import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { pageIsLoading, playerQueueLoadSecondaryItems, pagesSetQueryState } from '~/redux/actions'
import { getLoggedInUserMediaRefs, getLoggedInUserPlaylists, getPodcastsByQuery
  } from '~/services'

type Props = {
  listItems?: any[]
  pagesSetQueryState?: any
  queryPage?: number
  querySort?: string
  queryType?: string
  user?: any
}

type State = {}

const kPageKey = 'my_profile'

class MyProfile extends Component<Props, State> {

  static async getInitialProps({ bearerToken, query, req, store }) {
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings
    
    const currentPage = pages[kPageKey] || {}
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'podcasts'

    if (Object.keys(currentPage).length === 0) {
      let queryDataResult
      let listItems = []

      if (queryType === 'clips') {
        queryDataResult = await getLoggedInUserMediaRefs(bearerToken, nsfwMode, queryPage)
        listItems = queryDataResult.data
        listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
        store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
      } else if (queryType === 'playlists') {
        queryDataResult = await getLoggedInUserPlaylists(bearerToken, queryPage)
        listItems = queryDataResult.data
      } else if (queryType === 'podcasts' 
                  && user.subscribedPodcastIds
                  && user.subscribedPodcastIds.length > 0) {
        queryDataResult = await getPodcastsByQuery({
          from: 'subscribed-only',
          page: queryPage,
          subscribedPodcastIds: user.subscribedPodcastIds
        }, nsfwMode)
        listItems = queryDataResult.data
      }

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        listItems,
        queryPage,
        querySort,
        queryType
      }))
    }
    
    store.dispatch(pageIsLoading(false))

    return { user }
  }

  render() {
    const { pagesSetQueryState, queryPage, querySort, queryType, user } = this.props

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
              handleSetPageQueryState={pagesSetQueryState}
              isMyProfilePage={true}
              loggedInUser={user}
              pageKey={kPageKey}
              queryPage={queryPage}
              querySort={querySort}
              queryType={queryType}
              profileUser={user} />
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)
