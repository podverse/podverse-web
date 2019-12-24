import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, playerQueueLoadSecondaryItems, pagesSetQueryState } from '~/redux/actions'
import { getLoggedInUserMediaRefs, getLoggedInUserPlaylists, getPodcastsByQuery
  } from '~/services'

type Props = {
  lastScrollPosition?: number
  listItems?: any[]
  meta?: any
  pageKey?: string
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
    const { pages, user } = state
    
    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'alphabetical'
    const queryType = currentPage.queryType || query.type || 'podcasts'

    if (Object.keys(currentPage).length === 0) {
      let queryDataResult
      let listItems = []

      if (queryType === 'clips') {
        queryDataResult = await getLoggedInUserMediaRefs(bearerToken, 'on', queryPage)
        listItems = queryDataResult.data
        listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
        store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
      } else if (queryType === 'playlists') {
        queryDataResult = await getLoggedInUserPlaylists(bearerToken, queryPage)
        listItems = queryDataResult.data
      } else if (
        queryType === 'podcasts' 
        && user.subscribedPodcastIds
        && user.subscribedPodcastIds.length > 0) {
        queryDataResult = await getPodcastsByQuery({
          from: 'subscribed-only',
          page: queryPage,
          sort: querySort,
          subscribedPodcastIds: user.subscribedPodcastIds
        })
        listItems = queryDataResult.data
      }

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        listItems: listItems[0],
        listItemsTotal: listItems[1],
        queryPage,
        querySort,
        queryType
      }))
    }
    
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'My Podverse Profile. Subscribe to podcasts, playlists, and other profiles',
      title: 'My Profile'
    }

    return { lastScrollPosition, meta, pageKey: kPageKey, user }
  }

  render() {
    const { meta, pageKey, pagesSetQueryState, queryPage, querySort, queryType, user
      } = this.props

    return (
      <div className='user-profile'>
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
              pageKey={pageKey}
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
