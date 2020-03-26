import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage
} from 'podverse-ui'
import Error from './_error'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { checkIfLoadingOnFrontEnd, clone, cookieGetQuery, getUrlFromRequestOrWindow,
  removeDoubleQuotes } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery, getMediaRefById } from '~/services/'

type Props = {
  errorCode?: number
  lastScrollPosition?: number
  listItems?: any
  mediaRef?: any
  meta?: any
  newPlayingItem?: any
  pageKey: string
  pages?: any
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

const kPageKey = 'clip_'

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { mediaPlayer, pages, user } = state
    const { nowPlayingItem } = mediaPlayer

    let mediaRefResult
    try {
      mediaRefResult = await getMediaRefById(query.id)
    } catch (err) {
      store.dispatch(pageIsLoading(false))
      return { errorCode: err.response && err.response.status || 500 }
    }

    const mediaRef = mediaRefResult.data
    let newPlayingItem
    if (!checkIfLoadingOnFrontEnd()) {
      newPlayingItem = convertToNowPlayingItem(mediaRef)
    }

    const localStorageQuery = cookieGetQuery(req, kPageKey)

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryFrom = currentPage.queryFrom || query.from || localStorageQuery.from || 'from-episode'
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || 'chronological'
    const queryType = currentPage.queryType || query.type || localStorageQuery.type || 'clips'
    let podcastId = ''
    let episodeId = ''

    if (queryFrom === 'from-podcast') {
      podcastId = mediaRef.episode.podcast.id
    } else if (queryFrom === 'from-episode') {
      episodeId = mediaRef.episode.id
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
          ...(!podcastId ? { includePodcast: true } : {}),
          sort: querySort,
          type: queryType
        })
      } else {
        results = await getMediaRefsByQuery({
          ...(episodeId ? { episodeId } : {}),
          from: queryFrom,
          ...(!episodeId && podcastId ? { includeEpisode: true } : {}),
          ...(!episodeId && !podcastId ? { includePodcast: true } : {}),
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        })
      }

      const listItems = results.data[0].map(x => convertToNowPlayingItem(x, mediaRef.episode, mediaRef.episode.podcast))
      const nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      const queuedListItems = clone(listItems)
      if (nowPlayingItemIndex > -1) {
        queuedListItems.splice(0, nowPlayingItemIndex + 1)
      }
      
      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems,
        listItemsTotal: results.data[1],
        podcast: mediaRef.episode.podcast,
        queryFrom,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))

    let meta = {}

    if (mediaRef) {
      meta = {
        currentUrl: getUrlFromRequestOrWindow(req),
        description: removeDoubleQuotes(`${mediaRef.episode.title} - ${mediaRef.episode.podcast.title}`),
        imageAlt: (mediaRef.episode.imageUrl || mediaRef.episode.podcast.imageUrl) ? 
          `${mediaRef.episode.imageUrl ? mediaRef.episode.title : mediaRef.episode.podcast.title}` : 'Podverse logo',
        imageUrl: mediaRef.episode.imageUrl || mediaRef.episode.podcast.shrunkImageUrl || mediaRef.episode.podcast.imageUrl,
        title: `${mediaRef.title ? mediaRef.title : 'untitled clip'}`
      }
    }
    
    return { lastScrollPosition, mediaRef, meta, newPlayingItem, pageKey: pageKeyWithId, queryFrom,
      querySort, queryType }
  }

  componentDidMount () {
    const { errorCode, playerQueue } = this.props

    if (errorCode) return

    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    const { errorCode, mediaRef, meta, pageKey, pages, pagesSetQueryState } = this.props
    const page = pages[pageKey] || {}
    const { queryFrom, queryPage, querySort, queryType } = page

    if (errorCode) {
      return <Error statusCode={errorCode} />
    }

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogImage={meta.imageUrl}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterImage={meta.imageUrl}
          twitterImageAlt={meta.imageAlt}
          twitterTitle={meta.title} />
        <MediaHeaderCtrl 
          mediaRef={mediaRef}
          pageKey={pageKey} />
        <MediaInfoCtrl
          mediaRef={mediaRef}
          pageKey={pageKey} />
        <MediaListCtrl
          episode={mediaRef.episode}
          episodeId={mediaRef.episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          includeOldest={queryType === 'episodes'}
          pageKey={pageKey}
          podcast={mediaRef.episode.podcast}
          podcastId={mediaRef.episode.podcast.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
