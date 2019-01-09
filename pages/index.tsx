import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery } from '~/services'
import { clone } from '~/lib/utility'

type Props = {
  listItems?: any
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

  static async getInitialProps({ query, store }) {
    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings
    
    const currentPage = pages[kPageKey] || {}
    const queryFrom = currentPage.queryFrom || query.from || 'all-podcasts'
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'clips'
    let podcastId = ''

    if (queryFrom === 'subscribed-only') {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0) {
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
        queryType
      }))
    }
    
    store.dispatch(pageIsLoading(false))

    return { queryFrom, queryPage, querySort, queryType }
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
    const { pagesSetQueryState, queryFrom, queryPage, querySort, queryType
      } = this.props
    
    return (
      <Fragment>
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
