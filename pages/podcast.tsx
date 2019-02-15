import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Error from 'next/error'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, getUrlFromRequestOrWindow, removeDoubleQuotes } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getMediaRefsByQuery, getPodcastById } from '~/services/'

type Props = {
  is404Page?: boolean
  meta?: any
  pageKeyWithId?: string
  pagesSetQueryState?: any
  playerQueue?: any
  podcast?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {}

const kPageKey = 'podcast_'

class Podcast extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const pageKeyWithId = `${kPageKey}${query.id}`
    const state = store.getState()
    const { pages, settings, user } = state
    const { nsfwMode } = settings

    try {
      const podcastResult = await getPodcastById(query.id, nsfwMode)
      const podcast = podcastResult.data

      if (!podcast) {
        store.dispatch(pageIsLoading(false))
        return { is404Page: true }
      }

      const currentPage = pages[pageKeyWithId] || {}
      const queryFrom = currentPage.queryFrom || query.from || 'from-podcast'
      const queryPage = currentPage.queryPage || query.page || 1
      const querySort = currentPage.querySort || query.sort || 'top-past-week'
      const queryType = currentPage.queryType || query.type || 'episodes'
      let podcastId = ''

      if (queryFrom === 'from-podcast') {
        podcastId = podcast.id
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
            from: queryFrom,
            page: queryPage,
            ...(podcastId ? { podcastId } : {}),
            sort: querySort,
            type: queryType
          }, nsfwMode)
        }

        let listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
        
        store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))

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
        description: removeDoubleQuotes(podcast.description),
        imageAlt: podcast.imageUrl ? podcast.title : 'Podverse logo',
        imageUrl: podcast.imageUrl,
        title: podcast.title
      }

      return { meta, pageKeyWithId, podcast, queryFrom, queryPage, querySort, queryType }

    } catch (error) {
      console.log(error)
      return {}
    }
  }

  componentDidMount() {
    const { is404Page, playerQueue } = this.props
    const { secondaryItems } = playerQueue

    if (is404Page) return

    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { is404Page, meta, pageKeyWithId, pagesSetQueryState, podcast, queryFrom,
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
        <MediaHeaderCtrl podcast={podcast} />
        <MediaInfoCtrl podcast={podcast} />
        <MediaListCtrl
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={pageKeyWithId}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType}
          podcastId={podcast.id} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Podcast)
