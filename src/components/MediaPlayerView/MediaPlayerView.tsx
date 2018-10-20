import React, { Fragment, ReactNode } from 'react'
import { MediaPlayer } from 'podverse-ui'

type Props = {
  children?: ReactNode
  nowPlayingData?: any
}

type State = {}

type NowPlayingItem = {
  clipEndTime?: number
  clipStartTime?: number
  clipTitle?: string
  episodeMediaUrl?: string
  episodeTitle?: string
  imageUrl?: string
  podcastTitle?: string
}

class MediaPlayerView extends React.Component<Props, State> {

  render () {    
    const { children, nowPlayingData } = this.props
    const nowPlayingItem = convertToNowPlayingItem(nowPlayingData)
    const { clipEndTime, clipStartTime, clipTitle, episodeMediaUrl, episodeTitle,
      imageUrl, podcastTitle } = nowPlayingItem

    return (
      <div className='view'>
        <div className='view__top'>
          {children}
        </div>
        <div className='view__bottom'>
          <MediaPlayer
            clipEndTime={clipEndTime}
            clipStartTime={clipStartTime}
            clipTitle={clipTitle}
            episodeMediaUrl={episodeMediaUrl}
            episodeTitle={episodeTitle}
            handleOnAutoplay={this.onAutoplay}
            handleOnEpisodeEnd={this.onEpisodeEnd}
            handleOnPastClipTime={this.onPastClipTime}
            handleOnSkip={this.onSkip}
            imageUrl={imageUrl}
            podcastTitle={podcastTitle}
            showAutoplay={true}
            showTimeJumpBackward={false} />
        </div>
      </div>
    )
  }

  onAutoplay () {
    console.log('onAutoplay')
  }

  onEpisodeEnd () {
    console.log('onEpisodeEnd')
  }

  onPastClipTime () {
    console.log('onPastClipTime')
  }

  onSkip () {
    console.log('onSkip')
  }

}

const convertToNowPlayingItem = (data) => {
  let nowPlayingItem: NowPlayingItem = {}

  // If it has a pubDate field, assume it is an Episode
  if (data.pubDate) {
    nowPlayingItem.episodeMediaUrl = data.mediaUrl
    nowPlayingItem.episodeTitle = data.title
    nowPlayingItem.imageUrl = data.podcast.imageUrl
    nowPlayingItem.podcastTitle = data.podcast.title
  } else { // Else assume it is a MediaRef
    nowPlayingItem.clipEndTime = data.endTime
    nowPlayingItem.clipStartTime = data.startTime
    nowPlayingItem.clipTitle = data.title
    nowPlayingItem.episodeMediaUrl = data.episode.mediaUrl
    nowPlayingItem.episodeTitle = data.episode.title
    nowPlayingItem.imageUrl = data.episode.podcast.imageUrl
    nowPlayingItem.podcastTitle = data.episode.podcast.title
  }

  return nowPlayingItem
}

export default MediaPlayerView