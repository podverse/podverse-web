import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { isPageLoading, mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodeById, getMediaRefsByQuery } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  currentId?: string
  episode?: any
  listItems?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Episode extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state
    const episodeResult = await getEpisodeById(query.id)
    const episode = episodeResult.data
    const currentId = episode.id

    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(episode)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getMediaRefsByQuery(query)
    const listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))

    store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    store.dispatch(isPageLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { currentId, episode, listItems, query, queryFrom, querySort, queryType, user }
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { currentId, episode, listItems, queryFrom, queryPage, querySort, queryType
      } = this.props

    return (
      <Fragment>
        <MediaHeaderCtrl episode={episode} />
        <MediaInfoCtrl episode={episode} />
        <MediaListCtrl
          currentId={currentId}
          episodeId={episode.id}
          listItems={listItems}
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

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Episode)
