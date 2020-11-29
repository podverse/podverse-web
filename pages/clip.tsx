import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { convertToNowPlayingItem } from 'podverse-shared'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage
} from 'podverse-ui'
import Error from './_error'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { checkIfLoadingOnFrontEnd, clone, cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery, getMediaRefById,
  retrieveLatestChaptersForEpisodeId } from '~/services/'
import { withTranslation } from '~/../i18n'
const { BASE_URL } = config()

type Props = {
  errorCode?: number
  hasOfficialChapters?: boolean
  lastScrollPosition?: number
  listItems?: any
  mediaRef?: any
  newPlayingItem?: any
  pageKey: string
  pages?: any
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${PV.pageKeys.clip}${query.id}`
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

    const localStorageQuery = cookieGetQuery(req, PV.pageKeys.clip)

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryFrom = currentPage.queryFrom || query.from || localStorageQuery.from || PV.queryParams.from_episode
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.chronological
    let queryType = currentPage.queryType || query.type || localStorageQuery.type || PV.queryParams.clips
    let podcastId = ''
    let episodeId = ''

    const hasOfficialChapters = mediaRef.episode.chaptersUrl
    if (hasOfficialChapters) queryType = PV.queryParams.officialChapters

    if (queryFrom === PV.queryParams.from_podcast) {
      podcastId = mediaRef.episode.podcast.id
    } else if (queryFrom === PV.queryParams.from_episode) {
      episodeId = mediaRef.episode.id
    } else if (queryFrom === PV.queryParams.subscribed_only) {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0) {
      let results

      if (queryType === PV.queryParams.officialChapters) {
        episodeId = mediaRef.episode.id
        results = await retrieveLatestChaptersForEpisodeId(episodeId)
      } else if (queryType === PV.queryParams.episodes) {
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
          type: queryType,
          allowUntitled: true
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

    const namespacesRequired = PV.nexti18next.namespaces
    
    return { hasOfficialChapters, lastScrollPosition, mediaRef, namespacesRequired, newPlayingItem,
      pageKey: pageKeyWithId, queryFrom, querySort, queryType }
  }

  componentDidMount () {
    const { errorCode, playerQueue } = this.props

    if (errorCode) return

    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    const { errorCode, hasOfficialChapters, mediaRef, pageKey, pages,
      pagesSetQueryState, t } = this.props
    const page = pages[pageKey] || {}
    const { queryFrom, queryPage, querySort, queryType } = page

    if (errorCode) {
      return <Error statusCode={errorCode} />
    }

    let meta = {} as any
    if (mediaRef) {
      const { episode } = mediaRef
      const podcastTitle =
        (episode && episode.podcast && episode.podcast.title)
        || t('untitledClip')
      meta = {
        currentUrl: BASE_URL + PV.paths.web.clip + '/' + mediaRef.id,
        description: `${mediaRef.episode.title} - ${podcastTitle}`,
        imageAlt: podcastTitle,
        imageUrl:
          (episode && episode.shrunkImageUrl)
          || (episode.podcast && episode.podcast.shrunkImageUrl)
          || episode.imageUrl
          || (episode.podcast && episode.podcast.imageUrl),
        title: `${mediaRef.title ? mediaRef.title : t('untitledPodcast')}`
      }
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
          episode={mediaRef && mediaRef.episode}
          mediaRef={mediaRef}
          pageKey={pageKey}
          podcast={mediaRef && mediaRef.episode && mediaRef.episode.podcast} />
        <MediaInfoCtrl
          episode={mediaRef && mediaRef.episode}
          initialShowDescription={true}
          mediaRef={mediaRef}
          pageKey={pageKey}
          podcast={mediaRef && mediaRef.episode && mediaRef.episode.podcast} />
        <MediaListCtrl
          allowUntitledClips={true}
          episode={mediaRef.episode}
          episodeId={mediaRef.episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          hasOfficialChapters={hasOfficialChapters}
          includeOldest={queryType === PV.queryParams.episodes}
          pageKey={pageKey}
          podcast={mediaRef.episode.podcast}
          podcastId={mediaRef.episode.podcast.id}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType}
          showQueryTypeSelect={true} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Clip))
