import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaHeaderCtrl from '~/components/MediaHeaderCtrl/MediaHeaderCtrl'
import MediaInfoCtrl from '~/components/MediaInfoCtrl/MediaInfoCtrl'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { pageIsLoading, playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getEpisodesByQuery, getPodcastById } from '~/services/'
import { clone } from '~/lib/utility'

type Props = {
  currentId?: string
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

type State = {}

class Podcast extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { settings, user } = state
    const { nsfwMode } = settings

    const podcastResult = await getPodcastById(query.id)
    const podcast = podcastResult.data
    const currentId = podcast.id

    query.from = 'from-podcast'
    query.podcastId = podcast.id
    const queryDataResult = await getEpisodesByQuery(query, nsfwMode)
    const listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))

    store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    store.dispatch(pageIsLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { currentId, listItems, podcast, query, queryFrom, querySort, queryType, user }
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { currentId, listItems, podcast, queryFrom, queryPage, querySort, queryType
      } = this.props

    return (
      <Fragment>
        <MediaHeaderCtrl podcast={podcast} />
        <MediaInfoCtrl podcast={podcast} />
        <MediaListCtrl
          currentId={currentId}
          listItems={listItems}
          queryFrom={queryFrom || 'from-podcast'}
          queryPage={queryPage || 1}
          querySort={querySort || 'top-past-week'}
          queryType={queryType || 'episodes'}
          podcastId={podcast.id} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Podcast)
