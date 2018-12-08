import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { pageIsLoading, playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getMediaRefsByQuery } from '~/services'
import { clone } from '~/lib/utility'

type Props = {
  listItems?: any
  playerQueue?: any
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

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { mediaPlayer, user } = state
    const { nowPlayingItem } = mediaPlayer

    const queryDataResult = await getMediaRefsByQuery(query)
    let listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))
    let nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    let queuedListItems = clone(listItems)
    nowPlayingItemIndex > -1 ? queuedListItems.splice(0, nowPlayingItemIndex + 1) : queuedListItems

    store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))
    store.dispatch(pageIsLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { listItems, query, queryFrom, querySort, queryType, user }
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
    const { listItems, queryFrom, queryPage, querySort, queryType } = this.props

    return (
      <Fragment>
        <MediaListCtrl
          adjustTopPosition
          listItems={listItems}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
