import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading, pagesSetQueryState,
  playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getEpisodeById, getEpisodesByQuery, getMediaRefsByQuery } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  episode?: any
  listItems?: any
  pageKeyWithId?: string
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

const kPageKey = 'podcast_'

class Episode extends Component<Props, State> {

  static async getInitialProps({ query, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings

    const episodeResult = await getEpisodeById(query.id)
    const episode = episodeResult.data

    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(episode)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const currentPage = pages[pageKeyWithId] || {}
    const queryFrom = currentPage.queryFrom || query.from || 'from-episode'
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'clips'
    let podcastId = ''
    let episodeId = ''

    if (queryFrom === 'from-podcast') {
      podcastId = episode.podcast.id
    } else if (queryFrom === 'from-episode') {
      episodeId = episode.id
    } else if (queryFrom === 'subscribed-only') {
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
          ...(episodeId ? { episodeId } : {}),
          from: queryFrom,
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        }, nsfwMode)
      }
      
      let listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
      let nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      let queuedListItems = clone(listItems)
      nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
      
      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems,
        queryFrom,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))

    return { episode, pageKeyWithId, queryFrom, querySort, queryType }
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { episode, pageKeyWithId, pagesSetQueryState, queryFrom, queryPage,
      querySort, queryType } = this.props

    return (
      <Fragment>
        <MediaHeaderCtrl episode={episode} />
        <MediaInfoCtrl episode={episode} />
        <MediaListCtrl
          episodeId={episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={pageKeyWithId}
          podcastId={episode.podcast.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(Episode)
