
import React, { Component } from 'react'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect } from 'podverse-ui'
import { getEpisodeUrl, getPodcastUrl, mediaListSelectItemsPlayer, 
  mediaListSubSelectItemsPlayer, mediaListSubSelectItemsSort } from '~/lib/constants'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { readableDate } from '~/lib/util';

type Props = {
  episode?: any
  listItems: any[]
  mediaRef?: any
  nowPlayingItem?: any
  podcast?: any
}

// Load data from state to render text immediately and prevent flash-of-content
// while the backend data loads
type State = {
  episode?: any
  listItems: any[]
  mediaRef?: any
  nowPlayingItem?: any
  podcast?: any
}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: []
  }

  constructor (props) {
    super(props)

    this.state = {
      episode: props.episode,
      listItems: props.listItems,
      mediaRef: props.mediaRef,
      nowPlayingItem: props.nowPlayingItem,
      podcast: props.podcast
    }
  }

  handleAnchorOnClick (event, data, itemType) {
    const { listItems } = this.state

    const newState = {
      episode: null,
      listItems,
      mediaRef: null,
      nowPlayingItem: null,
      podcast: null
    }

    if (itemType === 'episode') {
      newState.episode = data
    } else if (itemType === 'mediaRef') {
      newState.mediaRef = data
    } else if (itemType === 'nowPlayingItem') {
      newState.nowPlayingItem = data
    } else if (itemType === 'podcast') {
      newState.podcast = data
    }

    this.setState(newState)
    scrollToTopOfView()
  }

  render () {
    const { episode, listItems, mediaRef, nowPlayingItem, podcast } = this.state

    let headerBottomText, headerImageUrl, headerSubTitle, headerSubTitleLink,
      headerTitle, headerTitleLink, infoClipEndTime, infoClipStartTime,
      infoClipTitle, infoDescription, infoIsFullEpisode
    
    if (episode) {
      console.log(episode)
    } else if (mediaRef) {
      const { endTime, episodeDescription, episodeId, episodePubDate, episodeTitle,
        podcastId, podcastImageUrl, podcastTitle, startTime, title } = mediaRef

      headerBottomText = readableDate(episodePubDate)
      headerImageUrl = podcastImageUrl
      headerSubTitle = episodeTitle
      headerSubTitleLink = getEpisodeUrl(episodeId)
      headerTitle = podcastTitle
      headerTitleLink = getPodcastUrl(podcastId)
      infoClipEndTime = endTime
      infoClipStartTime = startTime
      infoClipTitle = title
      infoDescription = episodeDescription
      infoIsFullEpisode = !startTime && !endTime
    } else if (nowPlayingItem) {
      const { clipEndTime, clipStartTime, clipTitle, episodeDescription,
        episodeId, episodePubDate, episodeTitle, imageUrl, podcastId,
        podcastTitle } = nowPlayingItem

      headerBottomText = readableDate(episodePubDate)
      headerImageUrl = imageUrl
      headerSubTitle = episodeTitle
      headerSubTitleLink = getEpisodeUrl(episodeId)
      headerTitle = podcastTitle
      headerTitleLink = getPodcastUrl(podcastId)
      infoClipEndTime = clipEndTime
      infoClipStartTime = clipStartTime
      infoClipTitle = clipTitle
      infoDescription = episodeDescription
      infoIsFullEpisode = !clipStartTime && !clipEndTime
    } else if (podcast) {
      console.log(podcast)
    }

    const listItemNodes = listItems.map((x, index) =>
      <MediaListItem
        dataNowPlayingItem={x}
        handleAnchorOnClick={(e) => { this.handleAnchorOnClick(e, x, 'nowPlayingItem') }}
        hasLink={true}
        itemType='now-playing-item'
        key={`nowPlayingListItem${index}`}
        showMoreMenu={true} />
    )

    return (
      <div className='max-width'>
        <MediaHeader
          bottomText={headerBottomText}
          imageUrl={headerImageUrl}
          subTitle={headerSubTitle}
          subTitleLink={headerSubTitleLink}
          title={headerTitle}
          titleLink={headerTitleLink} />
        <MediaInfo
          clipEndTime={infoClipEndTime}
          clipStartTime={infoClipStartTime}
          clipTitle={infoClipTitle}
          description={infoDescription}
          isFullEpisode={infoIsFullEpisode} />
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
      </div>
    )
  }
}

export default MediaContentView
