import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from './_error'
import { convertToNowPlayingItem } from 'podverse-shared'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { checkIfLoadingOnFrontEnd, cookieGetQuery } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getEpisodeById, getMediaRefsByQuery, retrieveLatestChaptersForEpisodeId } from '~/services/'
import { withTranslation } from '~/../i18n'
const { PUBLIC_BASE_URL } = config()

type Props = {
  episode?: any
  errorCode?: number
  lastScrollPosition?: number
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
}

type State = {}

class Episode extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${PV.pageKeys.episode}${query.id}`
    const state = store.getState()
    const { pages } = state

    let episodeResult
    try {
      episodeResult = await getEpisodeById(query.id)
    } catch (err) {
      store.dispatch(pageIsLoading(false))
      return { errorCode: err.response && err.response.status || 500 }
    }

    const episode = episodeResult.data
    let newPlayingItem
    if (!checkIfLoadingOnFrontEnd()) {
      newPlayingItem = convertToNowPlayingItem(episode)
    }

    const localStorageQuery = cookieGetQuery(req, PV.pageKeys.episode)

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryFrom = currentPage.queryFrom || query.from || localStorageQuery.from || PV.queryParams.from_episode
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || PV.queryParams.top_past_week
    const queryType = currentPage.queryType || query.type || PV.queryParams.clips
    let podcastId = ''
    let episodeId = ''


    if (queryFrom === PV.queryParams.from_podcast) {
      podcastId = episode.podcast.id
    } else {
      episodeId = episode.id
    }

    if (Object.keys(currentPage).length === 0) {
      let results

      if (queryType === PV.queryParams.chapters) {
        results = await retrieveLatestChaptersForEpisodeId(episodeId)
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

      const listItems = results.data[0].map(x => convertToNowPlayingItem(x, episode, episode.podcast))

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
    
    const namespacesRequired = PV.nexti18next.namespaces

    return { episode, lastScrollPosition, namespacesRequired,
      newPlayingItem, pageKey: pageKeyWithId, queryFrom, querySort, queryType }
  }

  render() {
    const { episode, errorCode, pageKey, pages, pagesSetQueryState, t } = this.props
    const page = pages[pageKey] || {}
    const { queryFrom, queryPage, querySort, queryType } = page

    if (errorCode) {
      return <Error statusCode={errorCode} />
    }

    let meta = {} as any
    if (episode) {
      const { podcast } = episode
      const podcastTitle = (podcast && podcast.title) || t('untitledPodcast')
      meta = {
        currentUrl: PUBLIC_BASE_URL + PV.paths.web.episode + '/' + episode.id,
        description: episode.description,
        imageAlt: podcastTitle,
        imageUrl:
          episode.shrunkImageUrl
          || episode.imageUrl
          || (podcast && podcast.shrunkImageUrl)
          || (podcast && podcast.imageUrl),
        title: `${episode.title} - ${podcastTitle}`
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
          episode={episode}
          pageKey={pageKey} />
        <MediaInfoCtrl
          episode={episode}
          initialShowDescription={true}
          pageKey={pageKey}
          podcast={episode.podcast} />
        <MediaListCtrl
          allowUntitledClips={true}
          episode={episode}
          episodeId={episode.id}
          handleSetPageQueryState={pagesSetQueryState}
          includeOldest={queryType === PV.queryParams.episodes}
          pageKey={pageKey}
          podcast={episode.podcast}
          podcastId={episode.podcast.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Episode))
