import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from 'next/error'
import Meta from '~/components/Meta/Meta'
import UserHeaderCtrl from '~/components/UserHeaderCtrl/UserHeaderCtrl'
import UserMediaListCtrl from '~/components/UserMediaListCtrl/UserMediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getPodcastsByQuery, getPublicUser, getUserMediaRefs, getUserPlaylists
  } from '~/services'

type Props = {
  is404Page?: boolean
  lastScrollPosition?: number
  listItems?: any[]
  meta?: any
  pageKey?: string
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

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { pages, settings } = state
    const { nsfwMode } = settings

    const currentId = query.id
    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'alphabetical'
    const queryType = currentPage.queryType || query.type || 'podcasts'
    let publicUser = currentPage.publicUser

    if (Object.keys(currentPage).length === 0) {
      const response = await getPublicUser(currentId, nsfwMode)
      publicUser = response.data
      let queryDataResult
      let listItems = []

      if (!publicUser) {
        store.dispatch(pageIsLoading(false))
        return { is404Page: true }
      }

      if (query.type === 'clips') {
        queryDataResult = await getUserMediaRefs(currentId, nsfwMode, querySort, queryPage)
        listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
        store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
      } else if (query.type === 'playlists') {
        queryDataResult = await getUserPlaylists(currentId, nsfwMode, queryPage)
        listItems = queryDataResult.data
      } else if (queryType === 'podcasts' 
          && publicUser.subscribedPodcastIds
          && publicUser.subscribedPodcastIds.length > 0) {
        queryDataResult = await getPodcastsByQuery({
          from: 'subscribed-only',
          sort: querySort,
          subscribedPodcastIds: publicUser.subscribedPodcastIds
        }, nsfwMode)
        listItems = queryDataResult.data
      }

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems: listItems[0],
        listItemsTotal: listItems[1],
        publicUser,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))

    let meta = {}
    if (publicUser) {
      meta = {
        currentUrl: getUrlFromRequestOrWindow(req),
        description: `${publicUser.name ? publicUser.name : 'anonymous'}'s profile on Podverse`,
        title: `${publicUser.name ? publicUser.name : 'anonymous'}'s profile on Podverse`
      }
    }

    return { lastScrollPosition, meta, pageKey: pageKeyWithId, publicUser }
  }

  render() {
    const { is404Page, meta, pageKey, pagesSetQueryState, publicUser,
      queryPage, querySort, queryType, user } = this.props

    if (is404Page) {
      return <Error statusCode={404} />
    }

    return (
      <div className='user-profile'>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={!publicUser.isPublic}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
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
                pageKey={pageKey}
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
