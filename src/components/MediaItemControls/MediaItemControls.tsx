import { faEllipsisH, faPause, faPlay } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import OmniAural, { useOmniAural } from "omniaural"
import type { Episode, MediaRef, NowPlayingItem, Podcast } from 'podverse-shared'
import { convertToNowPlayingItem } from 'podverse-shared'
import { readableDate } from "~/lib/utility/date"
import { convertSecToHhoursMMinutes, readableClipTime } from "~/lib/utility/time"
import { playerCheckIfCurrentlyPlayingItem, playerTogglePlayOrLoadNowPlayingItem } from "~/services/player/player"
import { addQueueItemLastOnServer, addQueueItemNextOnServer } from "~/services/userQueueItem"
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
const _markAsPlayedKey = '_markAsPlayedKey'

export const MediaItemControls = ({ buttonSize, episode, hidePubDate,
  mediaRef, stretchMiddleContent, podcast }: Props) => {
  const [userInfo] = useOmniAural('session.userInfo')
  const [player] = useOmniAural('player')
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

  const nowPlayingItem: NowPlayingItem = mediaRef
    ? convertToNowPlayingItem(mediaRef, episode, podcast)
    : convertToNowPlayingItem(episode, null, podcast)

  const timeWrapperClass = classNames(
    'time-wrapper',
    stretchMiddleContent ? 'flex-stretch' : ''
  )

  /* Function Helpers */
  
  const onChange = async (selected) => {
    const item = selected[0]
    if (item) {
      if (item.key === _playKey) {
        await _handleTogglePlay()
      } else if (item.key === _queueNextKey) {
        await _handleQueueNext()
      } else if (item.key === _queueLastKey) {
        await _handleQueueLast()
      } else if (item.key === _addToPlaylistKey) {
        await _handleAddToPlaylist()
      } else if (item.key === _markAsPlayedKey) {
        console.log('mark as played')
      }
    }
  }

  const _handleTogglePlay = async () => {
    await playerTogglePlayOrLoadNowPlayingItem(nowPlayingItem)
  }

  const _handleQueueNext = async () => {
    if (userInfo) {
      const newUserQueueItems = await addQueueItemNextOnServer(nowPlayingItem)
      OmniAural.setUserQueueItems(newUserQueueItems)
    } else {
      OmniAural.modalsLoginToAlertShow('add item to queue')
    }
  }

  const _handleQueueLast = async () => {
    if (userInfo) {
      const newUserQueueItems = await addQueueItemLastOnServer(nowPlayingItem)
      OmniAural.setUserQueueItems(newUserQueueItems)
    } else {
      OmniAural.modalsLoginToAlertShow('add item to queue')
    }
  }

  const _handleAddToPlaylist = () => {
    if (userInfo) {
      OmniAural.modalsAddToPlaylistShow(nowPlayingItem)
    } else {
      OmniAural.modalsLoginToAlertShow('add item to playlist')
    }
  }

  /* Render Helpers */

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

  const dropdownItems = generateDropdownItems()
  const isCurrentlyPlayingItem = playerCheckIfCurrentlyPlayingItem(
    player.paused, nowPlayingItem)
  const togglePlayIcon = isCurrentlyPlayingItem ? faPause : faPlay
  const togglePlayClassName = isCurrentlyPlayingItem ? 'pause' : 'play'

  return (
    <div className='media-item-controls'>
      <ButtonCircle
        className={togglePlayClassName}
        faIcon={togglePlayIcon}
        onClick={_handleTogglePlay}
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
