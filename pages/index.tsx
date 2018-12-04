import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { isPageLoading, playerQueueLoadSecondaryItems } from '~/redux/actions'
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
    const { user } = state

    const queryDataResult = await getMediaRefsByQuery(query)
    const listItems = queryDataResult.data.map(x => convertToNowPlayingItem(x))

    store.dispatch(playerQueueLoadSecondaryItems(clone(listItems)))
    store.dispatch(isPageLoading(false))

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
    const { listItems, queryFrom, queryPage, querySort, queryType,
      user } = this.props
    const { subscribedPodcastIds } = user

    return (
      <Fragment>
        <MediaListCtrl
          adjustTopPosition
          listItems={listItems}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
