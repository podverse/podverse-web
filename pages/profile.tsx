import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getPodcastsByQuery, getPublicUser, getUserMediaRefs, getUserPlaylists } from '~/services'

type Props = {
  listItems?: any[]
  pageKeyWithId?: string
  pagesSetQueryState?: any
  publicUser?: any
  queryPage?: number
  querySort?: string
  queryType?: string
  user?: any
}

type State = {}

const kPageKey = 'public_profile_'

class Profile extends Component<Props, State> {

  static async getInitialProps({ query, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { pages, settings } = state
    const { nsfwMode } = settings

    const currentId = query.id
    const currentPage = pages[pageKeyWithId] || {}
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'podcasts'
    let publicUser = currentPage.publicUser

    if (Object.keys(currentPage).length === 0) {
      const response = await getPublicUser(currentId)
      publicUser = response.data
      let queryDataResult
      let listItems = []
      
      if (query.type === 'clips') {
        queryDataResult = await getUserMediaRefs(currentId, nsfwMode)
        listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
        store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
      } else if (query.type === 'playlists') {
        queryDataResult = await getUserPlaylists(currentId)
        listItems = queryDataResult.data
      } else if (queryType === 'podcasts' 
                  && user.subscribedPodcastIds
                  && user.subscribedPodcastIds.length > 0) {
        queryDataResult = await getPodcastsByQuery({
          from: 'subscribed-only',
          subscribedPodcastIds: publicUser.subscribedPodcastIds
        }, nsfwMode)
        listItems = queryDataResult.data
      }

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems,
        publicUser,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))

    return { pageKeyWithId, publicUser }
  }

  render() {
    const { pageKeyWithId, pagesSetQueryState, publicUser, queryPage, querySort,
      queryType, user } = this.props

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
                handleSetPageQueryState={pagesSetQueryState}
                loggedInUser={user}
                pageKey={pageKeyWithId}
                profileUser={publicUser}
                queryPage={queryPage}
                querySort={querySort}
                queryType={queryType} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
