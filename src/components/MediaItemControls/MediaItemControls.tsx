import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisH, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, NowPlayingItem, Podcast } from 'podverse-shared'
import { convertToNowPlayingItem } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { readableDate } from '~/lib/utility/date'
import { convertSecToHhoursMMinutes, getTimeLabelText, readableClipTime } from '~/lib/utility/time'
import { deleteMediaRef } from '~/services/mediaRef'
import {
  playerCheckIfItemIsCurrentlyPlaying,
  playerLoadNowPlayingItem,
  playerTogglePlayOrLoadNowPlayingItem
} from '~/services/player/player'
import { addOrUpdateHistoryItemOnServer, getHistoryItemsIndexFromServer } from '~/services/userHistoryItem'
import { addQueueItemLastOnServer, addQueueItemNextOnServer } from '~/services/userQueueItem'
import { modalsAddToPlaylistShowOrAlert } from '~/state/modals/addToPlaylist/actions'
import { ButtonCircle, Dropdown, Icon } from '..'

type Props = {
  buttonSize: 'medium' | 'large'
  clip?: MediaRef
  episode?: Episode
  hidePubDate?: boolean
  isLoggedInUserMediaRef?: boolean
  stretchMiddleContent?: boolean
  podcast?: Podcast
}

const _playKey = '_play'
const _queueNextKey = '_queueNext'
const _queueLastKey = '_queueLast'
const _addToPlaylistKey = '_addToPlaylist'
const _shareKey = '_share'
const _markAsPlayedKey = '_markAsPlayedKey'
const _markAsUnplayedKey = '_markAsUnplayedKey'
const _editClip = '_editClip'
const _deleteClip = '_deleteClip'

export const MediaItemControls = ({
  buttonSize,
  clip,
  episode,
  hidePubDate,
  isLoggedInUserMediaRef,
  podcast,
  stretchMiddleContent
}: Props) => {
  const [userInfo] = useOmniAural('session.userInfo')
  const [player] = useOmniAural('player')
  /* historyItemsIndex is way too big with useOmniAural */
  // const [historyItemsIndex] = useOmniAural('historyItemsIndex')
  const historyItemsIndex = OmniAural.state.historyItemsIndex.value()
  /* Since we're not using useOmniAural for historyItemsIndex, call setForceRefresh to re-render */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [forceRefresh, setForceRefresh] = useState<number>(0)
  const { t } = useTranslation()
  let pubDate = null
  let timeInfo = null
  const timeRemaining = null
  let completed = false
  if (clip) {
    pubDate = readableDate(clip.episode.pubDate)
    timeInfo = readableClipTime(clip.startTime, clip.endTime)
  } else if (episode) {
    pubDate = readableDate(episode.pubDate)
    const historyItem = historyItemsIndex.episodes[episode.id]
    if (historyItem) {
      timeInfo = getTimeLabelText(t, historyItem.d, episode.duration, historyItem.p)
      completed = historyItem.c
    } else if (episode.duration > 0) {
      timeInfo = convertSecToHhoursMMinutes(episode.duration)
    }
  }

  const nowPlayingItem: NowPlayingItem = clip
    ? convertToNowPlayingItem(clip, episode, podcast)
    : convertToNowPlayingItem(episode, null, podcast)

  const timeWrapperClass = classNames('time-wrapper', stretchMiddleContent ? 'flex-stretch' : '')

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
        await modalsAddToPlaylistShowOrAlert(nowPlayingItem)
      } else if (item.key === _shareKey) {
        if (clip) {
          OmniAural.modalsShareShowClip(clip.id, episode.id, podcast.id)
        } else if (episode) {
          OmniAural.modalsShareShowEpisode(episode.id, podcast.id)
        } else if (podcast) {
          OmniAural.modalsShareShowPodcast(podcast.id)
        }
      } else if (item.key === _markAsPlayedKey || item.key === _markAsUnplayedKey) {
        await _handleToggleMarkAsPlayed(item)
      } else if (item.key === _editClip) {
        const shouldPlay = false
        playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
        OmniAural.makeClipShowEditing(nowPlayingItem)
      } else if (item.key === _deleteClip) {
        const shouldDelete = window.confirm(t('Are you sure you want to delete this clip'))
        if (shouldDelete) {
          deleteMediaRef(nowPlayingItem.clipId)
        }
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

  const _handleToggleMarkAsPlayed = async (item: any) => {
    if (userInfo) {
      const { episodeDuration, userPlaybackPosition } = nowPlayingItem

      await addOrUpdateHistoryItemOnServer({
        nowPlayingItem,
        playbackPosition: userPlaybackPosition,
        mediaFileDuration: episodeDuration,
        forceUpdateOrderDate: false,
        skipSetNowPlaying: true,
        completed: item.key === _markAsPlayedKey
      })
      const newHistoryItemsIndex = await getHistoryItemsIndexFromServer()
      OmniAural.setHistoryItemsIndex(newHistoryItemsIndex)
      setForceRefresh(Math.random())
    } else {
      OmniAural.modalsLoginToAlertShow('mark as played')
    }
  }

  /* Render Helpers */

  const generateDropdownItems = () => {
    const items = [
      { label: 'Play', key: _playKey },
      { label: 'Queue Next', key: _queueNextKey },
      { label: 'Queue Last', key: _queueLastKey },
      { label: 'Add to Playlist', key: _addToPlaylistKey },
      { label: 'Share', key: _shareKey }
    ]

    if (!clip) {
      if (completed) {
        items.push({ label: 'Mark as Unplayed', key: _markAsUnplayedKey })
      } else {
        items.push({ label: 'Mark as Played', key: _markAsPlayedKey })
      }
    }

    if (isLoggedInUserMediaRef) {
      items.push({ label: 'Edit Clip', key: _editClip })
      items.push({ label: 'Delete Clip', key: _deleteClip })
    }

    return items
  }

  const dropdownItems = generateDropdownItems()
  const isCurrentlyPlayingItem = playerCheckIfItemIsCurrentlyPlaying(player.paused, nowPlayingItem)
  const togglePlayIcon = isCurrentlyPlayingItem ? faPause : faPlay
  const togglePlayClassName = isCurrentlyPlayingItem ? 'pause' : 'play'

  return (
    <div className='media-item-controls'>
      <ButtonCircle
        className={togglePlayClassName}
        faIcon={togglePlayIcon}
        onClick={_handleTogglePlay}
        size={buttonSize}
      />
      <div className={timeWrapperClass}>
        {!hidePubDate && <span className='pub-date'>{pubDate}</span>}
        {!!timeInfo && (
          <>
            {!hidePubDate && <span className='time-spacer'> • </span>}
            {timeRemaining ? (
              <span className='time-remaining'>{timeRemaining}</span>
            ) : (
              <span className='time-info'>{timeInfo}</span>
            )}
          </>
        )}
        {completed && (
          <span className='completed'>
            <Icon faIcon={faCheck} />
          </span>
        )}
      </div>
      <Dropdown
        dropdownWidthClass='width-medium'
        faIcon={faEllipsisH}
        hasClipEditButtons={dropdownItems.length > 6}
        hideCaret
        onChange={onChange}
        options={dropdownItems}
      />
    </div>
  )
}
