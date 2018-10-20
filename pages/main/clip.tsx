import React, { Component, Fragment } from 'react'
import axios from 'axios'
import MediaContentView from '~/components/MediaContentView/MediaContentView';
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import Meta from '~/components/meta'
import { getEpisodeUrl, getPodcastUrl } from '~/lib/constants'
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'
import { readableDate } from '~/lib/util';

type Props = {
  mediaRef: any
  mediaRefs: any[]
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
    
    return { mediaRef, mediaRefs }
  }

  onClickClipTime () {
    console.log('onClickClipTime')
  }

  render () {
    const { mediaRef, mediaRefs } = this.props
    const { endTime, episodeDescription, episodeId, episodePubDate, episodeTitle, 
      podcastId, podcastImageUrl, podcastTitle, startTime, title } = mediaRef
    
    return (
      <Fragment>
        <Meta />
        <MediaPlayerView nowPlayingData={mediaRef}>
          <MediaContentView
            headerBottomText={readableDate(episodePubDate)}
            headerImageUrl={podcastImageUrl}
            headerSubTitle={episodeTitle}
            headerSubTitleLink={getEpisodeUrl(episodeId)}
            headerTitle={podcastTitle}
            headerTitleLink={getPodcastUrl(podcastId)}
            infoClipEndTime={endTime}
            infoClipStartTime={startTime}
            infoClipTitle={title}
            infoDescription={episodeDescription}
            infoIsFullEpisode={!startTime && !endTime}
            listItems={mediaRefs} />
        </MediaPlayerView>
      </Fragment>
    )
  }

}