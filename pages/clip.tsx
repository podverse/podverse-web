import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { addItemsToSecondaryQueue, clearItemsFromSecondaryQueue } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem';
import { currentPageLoadMediaRef } from '~/redux/actions'
import { mediaPlayerLoadNowPlayingItem } from '~/redux/actions';
import { playerQueueLoadSecondaryItems } from '~/redux/actions/playerQueue';
import { currentPageLoadListItems } from '~/redux/actions/currentPage';

type Props = {
  currentPage: any
  playerQueue: any
}

type State = {}

class Clip extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {    
    const res = await axios.all([
      getMediaRefById(query.id), 
      getMediaRefsByQuery({ 
        podcastTitle: `The James Altucher Show`
      })
    ])

    const mediaRef = res[0].data;
    store.dispatch(currentPageLoadMediaRef(mediaRef))

    const mediaRefs = res[1].data;
    
    // @ts-ignore
    if (!process.browser) {
      const nowPlayingItem = convertToNowPlayingItem(mediaRef)
      store.dispatch(mediaPlayerLoadNowPlayingItem(nowPlayingItem))
    }

    const queueSecondaryItems: NowPlayingItem[] = []
    for (const mediaRef of mediaRefs) {
      queueSecondaryItems.push(convertToNowPlayingItem(mediaRef))
    }

    store.dispatch(currentPageLoadListItems(queueSecondaryItems))

    // @ts-ignore
    if (!process.browser) {
      store.dispatch(playerQueueLoadSecondaryItems(queueSecondaryItems))
    }
    
    return {}
  }

  componentDidMount () {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueue()
    addItemsToSecondaryQueue(secondaryItems)
  }

  render () {
    return (<MediaContentView />)
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
