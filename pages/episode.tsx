import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView'
import { getQueryDataForEpisodePage } from '~/lib/mediaListController'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { currentPageListItemsLoading, currentPageListItemsLoadingNextPage, currentPageLoadListItems,
  currentPageLoadEpisode, mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems
} from '~/redux/actions'
import { getEpisodeById } from '~/services/episode'
import { clone } from '~/lib/utility'

type Props = {
  currentPage?: any
  playerQueue?: any
}

type State = {}

class Episode extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { currentPage, user } = state
    const episodeResult = await getEpisodeById(query.id)
    const episode = episodeResult.data
    store.dispatch(currentPageLoadEpisode(episode))


    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(episode)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getQueryDataForEpisodePage(query, episode, user.subscribedPodcastIds)
    const queryData = queryDataResult.data

    let queueSecondaryItems: NowPlayingItem[] = []

    // Only keep the currentPage.listItems if beyond the first page query
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

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    return (<MediaContentView />)
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Episode)