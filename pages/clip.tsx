import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from 'next/error'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse_ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow, removeDoubleQuotes } from '~/lib/utility'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading, pagesSetQueryState, 
  playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery, getMediaRefById } from '~/services/'

type Props = {
  is404Page?: boolean
  listItems?: any
  mediaRef?: any
  meta?: any
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

const kPageKey = 'clip_'

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { mediaPlayer, pages, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings
     
    const mediaRefResult = await getMediaRefById(query.id, nsfwMode)
    const mediaRef = mediaRefResult.data

    if (!mediaRef) {
      store.dispatch(pageIsLoading(false))
      return { is404Page: true }
    }
    
    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const currentPage = pages[pageKeyWithId] || {}
    const queryFrom = currentPage.queryFrom || query.from || 'from-podcast'
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || 'top-past-week'
    const queryType = currentPage.queryType || query.type || 'clips'
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

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: removeDoubleQuotes(`${mediaRef.description} - ${mediaRef.episode.title} - ${mediaRef.episode.podcast.title}`),
      imageAlt: (mediaRef.episode.imageUrl || mediaRef.episode.podcast.imageUrl) ? 
        `${mediaRef.episode.imageUrl ? mediaRef.episode.title : mediaRef.episode.podcast.title}` : 'Podverse logo',
      imageUrl: mediaRef.episode.imageUrl || mediaRef.episode.podcast.imageUrl,
      title: `${mediaRef.title} - ${mediaRef.episode.title} - ${mediaRef.episode.podcast.title}`
    }
    
    return { mediaRef, meta, pageKeyWithId, queryFrom, querySort, queryType }
  }

  componentDidMount () {
    const { is404Page, playerQueue } = this.props    

    if (is404Page) return

    const { secondaryItems } = playerQueue
    
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    const { is404Page, mediaRef, meta, pageKeyWithId, pagesSetQueryState, queryFrom,
      queryPage, querySort, queryType } = this.props

    if (is404Page) {
      return <Error statusCode={404} />
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
        <MediaHeaderCtrl mediaRef={mediaRef} />
        <MediaInfoCtrl mediaRef={mediaRef} />
        <MediaListCtrl
          episodeId={mediaRef.episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={pageKeyWithId}
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
