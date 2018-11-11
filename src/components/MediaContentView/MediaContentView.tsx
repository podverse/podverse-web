
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect,
  addItemToPriorityQueueStorage, getPriorityQueueItemsStorage } from 'podverse-ui'
import { getEpisodeUrl, getPodcastUrl, mediaListSelectItemsPlayer, 
  mediaListSubSelectItemsPlayer, mediaListSubSelectItemsSort } from '~/lib/constants'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { readableDate } from '~/lib/util';
import { bindActionCreators } from 'redux';
import { currentPageLoadNowPlayingItem, playerQueueLoadPriorityItems } from '~/redux/actions';

type Props = {
  currentPage?: any
  currentPageLoadNowPlayingItem?: any
  mediaPlayer?: any
  playerQueue?: any
  playerQueueLoadPriorityItems?: any
}

type State = {}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    currentPage: {
      listItems: []
    }
  }

  constructor (props) {
    super(props)
  }

  handleAddToQueueLast(nowPlayingItem) {
    const { playerQueueLoadPriorityItems } = this.props
    addItemToPriorityQueueStorage(nowPlayingItem, true)
    const priorityItems = getPriorityQueueItemsStorage()
    playerQueueLoadPriorityItems(priorityItems)
  }

  handleAddToQueueNext(nowPlayingItem) {
    const { playerQueueLoadPriorityItems } = this.props
    addItemToPriorityQueueStorage(nowPlayingItem, false)
    const priorityItems = getPriorityQueueItemsStorage()
    playerQueueLoadPriorityItems(priorityItems)
  }

  handleAnchorOnClick (event, data, itemType) {
    const { currentPageLoadNowPlayingItem } = this.props

    if (itemType === 'episode') {
      // newState.episode = data
    } else if (itemType === 'mediaRef') {
      // newState.mediaRef = data
    } else if (itemType === 'nowPlayingItem') {
      currentPageLoadNowPlayingItem(data)
    } else if (itemType === 'podcast') {
      // newState.podcast = data
    }

    scrollToTopOfView()
  }

  handlePlayItem(nowPlayingItem) {

  }

  render () {
    const { currentPage } = this.props
    const { episode, listItems, mediaRef, nowPlayingItem, podcast } = currentPage

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
        handleAddToQueueLast={(e) => { this.handleAddToQueueLast(x) }}
        handleAddToQueueNext={(e) => { this.handleAddToQueueNext(x) }}
        handleAnchorOnClick={(e) => { this.handleAnchorOnClick(e, x, 'nowPlayingItem') }}
        handlePlayItem={(e) => { this.handlePlayItem(x) }}
        hasLink={true}
        itemType='now-playing-item'
        key={`nowPlayingListItem${index}`}
        showMoreMenu={true} />
    )

    return (
      <Fragment>
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
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentView)
