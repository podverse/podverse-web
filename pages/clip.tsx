import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { addItemsToSecondaryQueue, clearItemsFromSecondaryQueue } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem';
import { currentPageLoadMediaRef } from '~/redux/actions'

type Props = {
  currentPage: any
  mediaRef: any
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
    
    let nowPlayingItem: NowPlayingItem = {}

    // @ts-ignore
    if (!process.browser) {
      nowPlayingItem = convertToNowPlayingItem(mediaRef)
    }

    const queueSecondaryItems: NowPlayingItem[] = []
    for (const mediaRef of mediaRefs) {
      queueSecondaryItems.push(convertToNowPlayingItem(mediaRef))
    }
    
    return { nowPlayingItem, queueSecondaryItems }
  }

  componentDidMount () {
    const { queueSecondaryItems } = this.props
    clearItemsFromSecondaryQueue()
    addItemsToSecondaryQueue(queueSecondaryItems)
  }

  onClickClipTime () {
    console.log('onClickClipTime')
  }

  render () {
    const { currentPage } = this.props
    const { mediaRef } = currentPage

    return (
      <MediaContentView mediaRef={mediaRef} />
    )
  }

}

const mapStateToProps = state => {
  return {
    ...state,
    currentPage: {
      episode: state.currentPage.episode,
      mediaRef: state.currentPage.mediaRef,
      nowPlayingItem: state.currentPage.nowPlayingItem,
      podcast: state.currentPage.podcast
    }
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
