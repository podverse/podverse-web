import React, { Component, Fragment } from 'react'
import axios from 'axios'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import { getEpisodeUrl, getPodcastUrl } from '~/lib/constants'
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { readableDate } from '~/lib/util';
import { NowPlayingItem, convertToNowPlayingItem } from '~/lib/nowPlayingItem';

type Props = {
  nowPlayingItem: NowPlayingItem
  secondaryQueueItems: NowPlayingItem[]
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
    
    const nowPlayingItem: NowPlayingItem = convertToNowPlayingItem(mediaRef)

    const secondaryQueueItems: NowPlayingItem[] = []
    for (const mediaRef of mediaRefs) {
      secondaryQueueItems.push(convertToNowPlayingItem(mediaRef))
    }
    
    return { nowPlayingItem, secondaryQueueItems }
  }

  onClickClipTime () {
    console.log('onClickClipTime')
  }

  render () {
    const { nowPlayingItem, secondaryQueueItems } = this.props
    const { clipEndTime, clipStartTime, clipTitle, episodeDescription, episodeId,
      episodePubDate, episodeTitle, imageUrl, podcastId, podcastTitle } = nowPlayingItem

    return (
      <MediaContentView
        headerBottomText={readableDate(episodePubDate)}
        headerImageUrl={imageUrl}
        headerSubTitle={episodeTitle}
        headerSubTitleLink={getEpisodeUrl(episodeId)}
        headerTitle={podcastTitle}
        headerTitleLink={getPodcastUrl(podcastId)}
        infoClipEndTime={clipEndTime}
        infoClipStartTime={clipStartTime}
        infoClipTitle={clipTitle}
        infoDescription={episodeDescription}
        infoIsFullEpisode={!clipStartTime && !clipEndTime}
        listItems={secondaryQueueItems} />
    )
  }

}