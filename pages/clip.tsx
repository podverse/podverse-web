import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage
  } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView'
import { getQueryDataForMediaRefPage } from '~/lib/mediaListController'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { currentPageLoadListItems, currentPageLoadMediaRef,
  mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems, currentPageListItemsLoading } from '~/redux/actions'
import { getMediaRefById } from '~/services/mediaRef'
type Props = {
  currentPage?: any
  playerQueue?: any
  playerQueueLoadPrimaryItems?: any
  playerQueueLoadSecondaryItems?: any
}

type State = {}

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const mediaRefResult = await getMediaRefById(query.id)
    const mediaRef = mediaRefResult.data
    store.dispatch(currentPageLoadMediaRef(mediaRef))

    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const subscribedPodcastIds = ['XFxLTOM9h-', 'ZuT5bspVRC']

    const queryDataResult = await getQueryDataForMediaRefPage(query, mediaRef, subscribedPodcastIds)
    const queryData = queryDataResult.data

    const queueSecondaryItems: NowPlayingItem[] = []
    for (const data of queryData) {
      queueSecondaryItems.push(convertToNowPlayingItem(data))
    }

    store.dispatch(currentPageLoadListItems(queueSecondaryItems))
    store.dispatch(currentPageListItemsLoading(false))

    // @ts-ignore
    if (!process.browser) {
      store.dispatch(playerQueueLoadSecondaryItems(queueSecondaryItems))
    }
    
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
