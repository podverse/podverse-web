import { faEllipsisH, faPlay } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import OmniAural from "omniaural"
import type { Episode, MediaRef, Podcast } from 'podverse-shared'
import { convertToNowPlayingItem } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { readableDate } from "~/lib/utility/date"
import { convertSecToHhoursMMinutes, readableClipTime } from "~/lib/utility/time"
import { ButtonCircle, Dropdown } from ".."

type Props = {
  buttonSize: 'medium' | 'large'
  episode?: Episode
  hidePubDate?: boolean
  mediaRef?: MediaRef
  stretchMiddleContent?: boolean
  podcast?: Podcast
}

const _playKey = '_play'
const _queueNextKey = '_queueNext'
const _queueLastKey = '_queueLast'
const _addToPlaylistKey = '_addToPlaylist'
const _shareKey = '_share'
const _markAsPlayedKey = '_markAsPlayedKey'

export const MediaItemControls = ({ buttonSize, episode, hidePubDate,
  mediaRef, stretchMiddleContent, podcast }: Props) => {
  const { t } = useTranslation()
  let pubDate = null
  let timeInfo = null
  let timeRemaining = null
  if (mediaRef) {
    pubDate = readableDate(mediaRef.episode.pubDate)
    timeInfo = readableClipTime(mediaRef.startTime, mediaRef.endTime)
  } else if (episode) {
    pubDate = readableDate(episode.pubDate)
    if (episode.duration > 0) {
      timeInfo = convertSecToHhoursMMinutes(episode.duration)
    }
    // timeRemaining
  }

  const dropdownItems = generateDropdownItems()

  const timeWrapperClass = classNames(
    'time-wrapper',
    stretchMiddleContent ? 'flex-stretch' : ''
  )
  
  const onChange = (selected) => {
    const item = selected[0]
    if (item) {
      if (item.key === _playKey) {
        console.log('play')
      } else if (item.key === _queueNextKey) {
        console.log('queue next')
      } else if (item.key === _queueLastKey) {
        console.log('queue last')
      } else if (item.key === _addToPlaylistKey) {
        const nowPlayingItem = mediaRef ? convertToNowPlayingItem(mediaRef)
          : convertToNowPlayingItem(episode)
        OmniAural.modalsAddToPlaylistShow(nowPlayingItem)
      } else if (item.key === _shareKey) {
        console.log('share')
      } else if (item.key === _markAsPlayedKey) {
        console.log('mark as played')
      }
    }
  }

  return (
    <div className='media-item-controls'>
      <ButtonCircle
        className='play'
        faIcon={faPlay}
        onClick={() => OmniAural.setPlayerItem(episode, {inheritedPodcast: podcast})}
        size={buttonSize} />
      <div className={timeWrapperClass}>
        {!hidePubDate && <span className='pub-date'>{pubDate}</span>}
        {!!timeInfo && (
          <>
            {!hidePubDate && <span className='time-spacer'> • </span>}
            {
              timeRemaining ? (
                <span className='time-remaining'>{timeRemaining}</span>
              ) : (
                <span className='time-info'>{timeInfo}</span>
              )
            }
          </>
        )}
      </div>
      <Dropdown
        dropdownWidthClass='width-medium'
        faIcon={faEllipsisH}
        hideCaret
        onChange={onChange}
        options={dropdownItems} />
    </div>
  )
}

const generateDropdownItems = () => {
  const items = [
    { label: 'Play', key: _playKey },
    { label: 'Queue Next', key: _queueNextKey },
    { label: 'Queue Last', key: _queueLastKey },
    { label: 'Add to Playlist', key: _addToPlaylistKey },
    // { label: 'Mark as Played', key: _markAsPlayedKey }
  ]

  return items
}
