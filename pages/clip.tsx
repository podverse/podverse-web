import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView'
import { getQueryDataForClipPage } from '~/lib/mediaListController'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { currentPageListItemsLoading,
  currentPageListItemsLoadingNextPage, currentPageLoadListItems, 
  currentPageLoadMediaRef, mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getMediaRefById } from '~/services/mediaRef'
import { clone } from '~/lib/utility'

type Props = {
  currentPage?: any
  playerQueue?: any
}

type State = {}

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { currentPage, user } = state
    const mediaRefResult = await getMediaRefById(query.id)
    const mediaRef = mediaRefResult.data
    store.dispatch(currentPageLoadMediaRef(mediaRef))


    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getQueryDataForClipPage(query, mediaRef, user.subscribedPodcastIds)
    const queryData = queryDataResult.data

    let queueSecondaryItems: NowPlayingItem[] = []

    // If beyond the first page and browser-side, concat new secondaryItems with
    // the existing ones
    // @ts-ignore
    if (process.browser && query.page && query.page > 1) {
      const { listItems } = currentPage
      queueSecondaryItems = listItems
    }

    for (const data of queryData) {
      queueSecondaryItems.push(convertToNowPlayingItem(data))
    }

    store.dispatch(currentPageLoadListItems({
      listItems: queueSecondaryItems,
      listItemsEndReached: queryData && queryData.length === 0
    }))
    store.dispatch(currentPageListItemsLoading(false))
    store.dispatch(currentPageListItemsLoadingNextPage(false))

    store.dispatch(playerQueueLoadSecondaryItems(clone(queueSecondaryItems)))

    return {}
  }

  componentDidMount () {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    return (<MediaContentView />)
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
