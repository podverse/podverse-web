import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { isPageLoading, mediaPlayerLoadNowPlayingItem, playerQueueLoadSecondaryItems
  } from '~/redux/actions'
import { getEpisodesByQuery, getPodcastById } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  listItems?: any
  playerQueue?: any
  podcast?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {
  listItems?: any[]
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
}

class Podcast extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state
    const podcastResult = await getPodcastById(query.id)
    const podcast = podcastResult.data

    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(podcast)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queryDataResult = await getEpisodesByQuery(query)
    const listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))

    store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    store.dispatch(isPageLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { podcast, query, queryFrom, querySort, queryType, user }
  }

  constructor(props) {
    super(props)

    this.state = {
      listItems: props.listItems,
      queryFrom: props.queryFrom,
      queryPage: props.queryPage || 1,
      querySort: props.querySort,
      queryType: props.queryType
    }
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { listItems, podcast, queryFrom, queryPage, querySort, queryType,
      user } = this.props
    const { subscribedPodcastIds } = user

    return (
      <Fragment>
        <MediaHeaderCtrl podcast={podcast} />
        <MediaInfoCtrl podcast={podcast} />
        <MediaListCtrl
          listItems={listItems}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType}
          podcastId={podcast.id}
          subscribedPodcastIds={subscribedPodcastIds} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Podcast)
