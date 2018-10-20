import React, { Fragment } from 'react'
import { MediaControls, MediaHeader, MediaInfo, MediaListItem,
  MediaListSelect, MediaPlayer } from 'podverse-ui'
import { readableClipTime, readableDate } from '~/lib/util'
import { mediaListSelectItemsPlayer, mediaListSubSelectItemsPlayer,
  mediaListSubSelectItemsSort } from '~/lib/constants'

type Props = {
  listItems: any[]
  nowPlayingData?: any
}

type State = {}

type NowPlayingItem = {
  clipTitle?: string
  endTime?: number
  episodeDescription?: string
  episodeId?: string
  episodeMediaUrl?: string
  episodePubDate?: string
  episodeTitle?: string
  imageUrl?: string
  podcastId?: string
  podcastTitle?: string
  startTime?: number
}

class NowPlaying extends React.Component<Props, State> {

  static defaultProps: Props = {
    listItems: []
  }

  render () {    
    const { listItems, nowPlayingData } = this.props

    const nowPlayingItem = convertToNowPlayingItem(nowPlayingData)
    const { clipTitle, endTime, episodeDescription, episodeId, episodeMediaUrl,
      episodePubDate, episodeTitle, imageUrl, podcastId, podcastTitle,
      startTime } = nowPlayingItem
      
    const isFullEpisode = !!nowPlayingData.pubDate
    const episodePathPrefix = '/episode/'
    const podcastPathPrefix = '/podcast/'

    const autoplay = true
    const muted = true
    const playbackRate = 1.0
    const playing = true
    const volume = 1.0

    const listItemNodes = listItems.map((x, index) =>
      <MediaListItem 
        dataClip={x}
        itemType='clip'
        key={`nowPlayingListItem${index}`} />
    )

    return (
      <Fragment>
        <MediaHeader
          bottomText={episodePubDate}
          imageUrl={imageUrl}
          subTitle={episodeTitle}
          subTitleLink={`${episodePathPrefix}${episodeId}`}
          title={podcastTitle}
          titleLink={`${podcastPathPrefix}${podcastId}`} />
        <MediaPlayer
          autoplay={autoplay}
          clipEndTime={endTime}
          clipStartTime={startTime}
          handleOnEpisodeEnd={onEpisodeEnd}
          handleOnPastClipTime={onPastClipTime}
          handleOnPrevious={onPrevious}
          handleOnSkip={onSkip}
          muted={muted}
          playbackRate={playbackRate}
          playing={playing}
          url={episodeMediaUrl}
          volume={volume} />
        <MediaControls
          autoplay={autoplay}
          onClickAddToPlaylist={onClickAddToPlaylist}
          onClickAutoplay={onClickAutoplay}
          onClickMakeClip={onClickMakeClip}
          onClickShare={onClickShare}
          onClickTimeJumpBack={onClickTimeJumpBack}
          onClickTimeJumpForward={onClickTimeJumpForward}
          showAddToPlaylist={true}
          showAutoplay={true}
          showMakeClip={true}
          showShare={true}
          showTimeSkips={true} />
        <MediaInfo
          clipReadableTime={readableClipTime(startTime, endTime)}
          clipTitle={clipTitle}
          description={episodeDescription}
          onClickClipTime={onClickClipTime}
          isFullEpisode={isFullEpisode} />
        <div className='media-list'>
          <MediaListSelect 
            items={mediaListSelectItemsPlayer}
            selected={mediaListSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsPlayer}
            selected={mediaListSubSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsSort}
            selected={mediaListSubSelectItemsSort[0].value} />
          {listItemNodes}
        </div>
      </Fragment>
    )
  }
}

// Convert MediaRef or Episode data into a NowPlayingItem
const convertToNowPlayingItem = (data) => {
  let nowPlayingItem: NowPlayingItem = {}

  // If it has a pubDate field, assume it is an Episode
  if (data.pubDate) {
    nowPlayingItem.episodeId = data.id
    nowPlayingItem.episodeMediaUrl = data.mediaUrl
    nowPlayingItem.episodePubDate = readableDate(data.pubDate)
    nowPlayingItem.episodeTitle = data.title
    nowPlayingItem.imageUrl = data.podcast.imageUrl
    nowPlayingItem.podcastId = data.podcast.id
    nowPlayingItem.podcastTitle = data.podcast.title
    nowPlayingItem.startTime = 0
  } else { // Else assume it is a MediaRef
    nowPlayingItem.clipTitle = data.title
    nowPlayingItem.endTime = data.endTime
    nowPlayingItem.episodeMediaUrl = data.episode.mediaUrl
    nowPlayingItem.episodePubDate = readableDate(data.episode.pubDate)
    nowPlayingItem.episodeTitle = data.episode.title
    nowPlayingItem.imageUrl = data.episode.podcast.imageUrl
    nowPlayingItem.podcastTitle = data.episode.podcast.title
    nowPlayingItem.startTime = data.startTime
  }

  return nowPlayingItem
}

const onClickAddToPlaylist = () => {
  console.log('onClickAddToPlaylist')
}

const onClickAutoplay = () => {
  console.log('onClickAutoplay')
}

const onClickMakeClip = () => {
  console.log('onClickMakeClip')
}

const onClickShare = () => {
  console.log('onClickShare')
}

const onClickTimeJumpBack = () => {
  console.log('onClickTimeJumpBack')
}

const onClickTimeJumpForward = () => {
  console.log('onClickTimeJumpForward')
}

const onClickClipTime = () => {
  console.log('onClickClipTime')
}

const onEpisodeEnd = () => {
  console.log('onEpisodeEnd')
}

const onPastClipTime = () => {
  console.log('onPastClipTime')
}

const onPrevious = () => {
  console.log('onPrevious')
}

const onSkip = () => {
  console.log('onSkip')
}

// const mapStateToProps = (state) => {
//   const {listItems, nowPlayingItem} = state
//   return { listItems, nowPlayingItem }
// }

export default NowPlaying