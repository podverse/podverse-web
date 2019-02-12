import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery } from '~/services'

type Props = {
  listItems?: any
  meta?: any
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {}

const kPageKey = 'home'

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings
    
    const currentPage = pages[kPageKey] || {}
    const queryRefresh = !!query.refresh
    const queryFrom = currentPage.queryFrom || query.from || 'all-podcasts'
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'clips'
    let podcastId = ''

    if (queryFrom === 'subscribed-only') {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0 || queryRefresh) {
      let queryDataResult

      if (queryType === 'episodes') {
        queryDataResult = await getEpisodesByQuery({
          from: queryFrom,
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        }, nsfwMode)
      } else {
        queryDataResult = await getMediaRefsByQuery({
          from: queryFrom,
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        }, nsfwMode)
      }
      
      let listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x)) || []
      let nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      let queuedListItems = clone(listItems)
      nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems

      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))
      
      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        listItems,
        queryFrom,
        queryPage,
        querySort,
        queryType,
        endReached: false,
        isLoadingInitial: false,
        isLoadingMore: false
      }))
    }
    
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'The Podverse web and iOS mobile app. Create and share clips of your favorite podcasts. Share playlists and your user profile. Sync podcasts between web and mobile. Open source and monopoly-proof software.',
      title: 'Podverse - Create podcast highlights'
    }

    return { meta, queryFrom, queryPage, querySort, queryType }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { meta, pagesSetQueryState, queryFrom, queryPage, querySort, queryType
      } = this.props
    
    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <MediaListCtrl
          adjustTopPosition
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={kPageKey}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
