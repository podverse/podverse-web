import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import Error from './_error'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, cookieGetQuery, removeDoubleQuotes } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery, getPodcastById } from '~/services/'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  errorCode?: number
  lastScrollPosition?: number
  meta?: any
  pageKey: string
  pages?: any
  pagesSetQueryState?: any
  playerQueue?: any
  podcast?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

const kPageKey = 'podcast_'

class Podcast extends Component<Props, State> {

  static async getInitialProps({ query, req, store, t }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { pages, user } = state

    let podcastResult
    try {
      podcastResult = await getPodcastById(query.id)
    } catch (err) {
      store.dispatch(pageIsLoading(false))
      return { errorCode: err.response && err.response.status || 500 }
    }

    const podcast = podcastResult.data

    const localStorageQuery = cookieGetQuery(req, kPageKey)

    const currentPage = pages[pageKeyWithId] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryFrom = currentPage.queryFrom || query.from || localStorageQuery.from || PV.queryParams.from_podcast
    const queryPage = currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.most_recent
    const queryType = currentPage.queryType || query.type || localStorageQuery.type || PV.queryParams.episodes
    let podcastId = ''

    if (queryFrom === PV.queryParams.from_podcast) {
      podcastId = podcast.id
    } else if (queryFrom === PV.queryParams.subscribed_only) {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0) {
      let results

      if (queryType === PV.queryParams.episodes) {
        results = await getEpisodesByQuery({
          from: queryFrom,
          ...(!podcastId ? { includePodcast: true } : {}),
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        })
      } else {
        results = await getMediaRefsByQuery({
          from: queryFrom,
          ...(!podcastId ? { includePodcast: true } : {}),
          page: queryPage,
          ...(podcastId ? { podcastId } : {}),
          sort: querySort,
          type: queryType
        })
      }

      const listItems = results.data[0].map(x => {
        const item = convertToNowPlayingItem(x, {}, podcast)
        item.podcastId = podcast.id
        item.podcastImageUrl = podcast.imageUrl
        item.podcastTitle = podcast.title
        return item
      })
      
      store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))

      store.dispatch(pagesSetQueryState({
        pageKey: pageKeyWithId,
        listItems,
        listItemsTotal: results.data[1],
        podcast,
        queryFrom,
        queryPage,
        querySort,
        queryType
      }))
    }

    store.dispatch(pageIsLoading(false))
    const podcastTitle = podcast.title || t('untitledPodcast')
    const meta = {
      currentUrl: BASE_URL + PV.paths.web.podcast + '/' + podcast.id,
      description: removeDoubleQuotes(podcast.description),
      imageAlt: podcastTitle,
      imageUrl: podcast.shrunkImageUrl || podcast.imageUrl,
      title: podcastTitle
    }
    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, meta, namespacesRequired, pageKey: pageKeyWithId, podcast, queryFrom, queryPage,
      querySort, queryType }
  }

  componentDidMount() {
    const { errorCode, playerQueue } = this.props
    const { secondaryItems } = playerQueue

    if (errorCode) return

    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { errorCode, meta, pageKey, pages, pagesSetQueryState, podcast } = this.props
    const page = pages[pageKey] || {}
    const { queryFrom, queryPage, querySort, queryType } = page

    if (errorCode) {
      return <Error statusCode={errorCode} />
    }

    return (
      <Fragment>
        <style>{`.media-info .media-info__description { margin-top: 0 }`}</style>
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
          pageKey={pageKey}
          podcast={podcast} />
        <MediaInfoCtrl
          pageKey={pageKey}
          podcast={podcast} />
        <MediaListCtrl
          handleSetPageQueryState={pagesSetQueryState}
          includeOldest={queryType === PV.queryParams.episodes}
          pageKey={pageKey}
          podcast={podcast}
          podcastId={podcast.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Podcast))
