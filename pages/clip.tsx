import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { isPageLoading, mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getMediaRefsByQuery, getMediaRefById } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  listItems?: any
  mediaRef?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state
    const mediaRefResult = await getMediaRefById(query.id)
    const mediaRef = mediaRefResult.data
    
    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getMediaRefsByQuery(query)
    const listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))

    store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    store.dispatch(isPageLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query

    return { listItems, mediaRef, query, queryFrom, querySort, queryType, user }
  }

  componentDidMount () {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    const { listItems, mediaRef, queryFrom, queryPage, querySort, queryType,
      user } = this.props
    const { subscribedPodcastIds } = user

    return (
      <Fragment>
        <MediaHeaderCtrl mediaRef={mediaRef} />
        <MediaInfoCtrl mediaRef={mediaRef} />
        <MediaListCtrl
          episodeId={mediaRef.episodeId}
          listItems={listItems}
          podcastId={mediaRef.podcastId}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType}
          subscribedPodcastIds={subscribedPodcastIds} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
