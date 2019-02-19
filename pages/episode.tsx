import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from 'next/error'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage
  } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow, removeDoubleQuotes } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodeById, getEpisodesByQuery, getMediaRefsByQuery } from '~/services/'

type Props = {
  episode?: any
  is404Page?: boolean
  lastScrollPosition?: number
  meta?: any
  newPlayingItem?: any
  pageKey?: string
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

const kPageKey = 'episode_'

class Episode extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings

    const episodeResult = await getEpisodeById(query.id, nsfwMode)
    const episode = episodeResult.data
    
    if (!episode) {
      store.dispatch(pageIsLoading(false))
      return { is404Page: true }
    }
    
    let newPlayingItem
    // @ts-ignore
    if (!process.browser) {
      newPlayingItem = convertToNowPlayingItem(episode)
    }

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
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
      let results

      if (queryType === 'episodes') {
        results = await getEpisodesByQuery({
          from: queryFrom,
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        }, nsfwMode)
      } else {
        results = await getMediaRefsByQuery({
          ...(episodeId ? { episodeId } : {}),
          from: queryFrom,
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        }, nsfwMode)
      }
      
      let listItems = results.data[0].map(x => convertToNowPlayingItem(x))
      let nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      let queuedListItems = clone(listItems)
      nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems
      
      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems,
        listItemsTotal: results[1],
        podcast: episode.podcast,
        queryFrom,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))
    
    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: removeDoubleQuotes(episode.description),
      imageAlt: (episode.imageUrl || episode.podcast.imageUrl)
        ? `${episode.imageUrl ? episode.title : episode.podcast.title}`
        : 'Podverse logo',
      imageUrl: episode.imageUrl || episode.podcast.imageUrl,
      title: `${episode.title} - ${episode.podcast.title}`
    }

    return { episode, lastScrollPosition, meta, newPlayingItem, pageKey: pageKeyWithId,
      queryFrom, querySort, queryType }
  }

  componentDidMount() {
    const { is404Page, playerQueue } = this.props
    
    if (is404Page) return

    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { episode, is404Page, meta, pageKey, pagesSetQueryState, queryFrom,
      queryPage, querySort, queryType } = this.props

    if (is404Page) {
      return <Error statusCode={404} />
    }

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
          twitterImageAlt={meta.imageAlt}
          twitterTitle={meta.title} />
        <MediaHeaderCtrl
          episode={episode}
          pageKey={pageKey} />
        <MediaInfoCtrl
          episode={episode}
          pageKey={pageKey} />
        <MediaListCtrl
          episodeId={episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={pageKey}
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
