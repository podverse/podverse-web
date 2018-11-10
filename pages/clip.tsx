import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { addItemsToSecondaryQueue, clearItemsFromSecondaryQueue } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem';
import { currentPageLoadMediaRef } from '~/redux/actions'
import { mediaPlayerLoadNowPlayingItem } from '~/redux/actions';

type Props = {
  currentPage: any
  queueSecondaryItems: NowPlayingItem[]
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
    
    return { queueSecondaryItems }
  }

  componentDidMount () {
    const { queueSecondaryItems } = this.props
    clearItemsFromSecondaryQueue()
    addItemsToSecondaryQueue(queueSecondaryItems)
  }

  render () {
    const { queueSecondaryItems } = this.props

    return (
      <MediaContentView 
        listItems={queueSecondaryItems} />
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
