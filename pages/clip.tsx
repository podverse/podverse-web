import React, { Component } from 'react'
import axios from 'axios'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem';
import { addItemsToSecondaryQueue } from 'podverse-ui'

type Props = {
  mediaRef: any
  queueSecondaryItems: NowPlayingItem[]
}

type State = {}

export default class extends Component<Props, State> {

  static async getInitialProps(req) {
    const res = await axios.all([
      getMediaRefById(req.query.id), 
      getMediaRefsByQuery({ 
        podcastTitle: `The James Altucher Show`
      })
    ])
    const mediaRef = res[0].data;
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
    
    return { mediaRef, nowPlayingItem, queueSecondaryItems }
  }

  componentDidMount () {
    const { queueSecondaryItems } = this.props
    addItemsToSecondaryQueue(queueSecondaryItems)
  }

  onClickClipTime () {
    console.log('onClickClipTime')
  }

  render () {
    const { mediaRef, queueSecondaryItems } = this.props

    return (
      <MediaContentView
        mediaRef={mediaRef}
        listItems={queueSecondaryItems} />
    )
  }

}