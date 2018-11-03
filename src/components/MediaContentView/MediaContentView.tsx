
import React, { Component, Fragment } from 'react'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect } from 'podverse-ui'
import { mediaListSelectItemsPlayer, mediaListSubSelectItemsPlayer,
  mediaListSubSelectItemsSort } from '~/lib/constants'

type Props = {
  headerBottomText?: string
  headerImageUrl?: string
  headerSubTitle?: string
  headerSubTitleLink?: string
  headerTitle?: string
  headerTitleLink?: string
  infoClipEndTime?: string
  infoClipStartTime?: string
  infoClipTitle?: string
  infoDescription?: string
  infoIsFullEpisode?: boolean
  infoOnClickClipTime?: string
  listItems: any[]
}

type State = {}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: []
  }

  render() {
    const { headerBottomText, headerImageUrl, headerSubTitle, headerSubTitleLink,
      headerTitle, headerTitleLink, infoClipEndTime, infoClipStartTime, infoClipTitle,
      infoDescription, infoIsFullEpisode, infoOnClickClipTime, listItems } = this.props

    const listItemNodes = listItems.map((x, index) =>
      <MediaListItem
        dataNowPlayingItem={x}
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
          isFullEpisode={infoIsFullEpisode}
          onClickClipTime={infoOnClickClipTime} />
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
