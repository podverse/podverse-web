import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getMediaRefsByQuery, getMediaRefById } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  currentId?: string
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
    const { mediaPlayer, settings, user } = state
    const { nowPlayingItem } = mediaPlayer
    const { nsfwMode } = settings
  
    const mediaRefResult = await getMediaRefById(query.id)
    const mediaRef = mediaRefResult.data
    const currentId = mediaRef.id
    
    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getMediaRefsByQuery(query, nsfwMode)
    let listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
    let nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    let queuedListItems = clone(listItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems

    store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))
    store.dispatch(pageIsLoading(false))
    
    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { currentId, listItems, mediaRef, query, queryFrom, querySort, queryType, user }
  }

  componentDidMount () {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render () {
    const { currentId, listItems, mediaRef, queryFrom, queryPage, querySort, queryType
      } = this.props

    return (
      <Fragment>
        <MediaHeaderCtrl mediaRef={mediaRef} />
        <MediaInfoCtrl mediaRef={mediaRef} />
        <MediaListCtrl
          currentId={currentId}
          episodeId={mediaRef.episodeId}
          listItems={listItems}
          podcastId={mediaRef.podcastId}
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

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
