import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisH, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, NowPlayingItem, Podcast } from 'podverse-shared'
import { convertToNowPlayingItem } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateItemTimeInfo } from '~/lib/utility/date'
import { deleteMediaRef } from '~/services/mediaRef'
import {
  playerCheckIfItemIsCurrentlyPlaying,
  playerLoadNowPlayingItem,
  playerTogglePlayOrLoadNowPlayingItem
} from '~/services/player/player'
import { addOrUpdateHistoryItemOnServer, getHistoryItemsIndexFromServer } from '~/services/userHistoryItem'
import { addQueueItemLastOnServer, addQueueItemNextOnServer } from '~/services/userQueueItem'
import { modalsAddToPlaylistShowOrAlert } from '~/state/modals/addToPlaylist/actions'
import { OmniAuralState } from '~/state/omniauralState'
import { ButtonCircle, Dropdown, Icon } from '..'
import { LiveStatusBadge } from '../LiveStatusBadge/LiveStatusBadge'

type Props = {
  buttonSize: 'small' | 'medium' | 'large'
  episode?: Episode
  hidePubDate?: boolean
  isChapter?: boolean
  isLiveItemNotLive?: boolean
  isLoggedInUserMediaRef?: boolean
  mediaRef?: MediaRef
  podcast?: Podcast
  stretchMiddleContent?: boolean
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
  episode,
  hidePubDate,
  isChapter,
  isLiveItemNotLive,
  isLoggedInUserMediaRef,
  mediaRef,
  podcast,
  stretchMiddleContent
}: Props) => {
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const [player] = useOmniAural('player') as [OmniAuralState['player']]

  /* Since we're not using useOmniAural for historyItemsIndex, call setForceRefresh to re-render */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [forceRefresh, setForceRefresh] = useState<number>(0)
  const { t } = useTranslation()

  const liveItem = episode?.liveItem
  const nowPlayingItem: NowPlayingItem = mediaRef
    ? convertToNowPlayingItem(mediaRef, episode, podcast)
    : convertToNowPlayingItem(episode, null, podcast)
  const { completed, pubDate, timeInfo, timeRemaining } = generateItemTimeInfo(t, episode, mediaRef, isChapter)

  const timeWrapperClass = classNames('time-wrapper', stretchMiddleContent ? 'flex-stretch' : '')

  nowPlayingItem.episodeImageUrl = mediaRef?.imageUrl ? mediaRef.imageUrl : nowPlayingItem.episodeImageUrl

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
        if (mediaRef) {
          const { episode } = mediaRef
          const { podcast } = episode
          OmniAural.modalsShareShowClip(mediaRef.id, episode.id, podcast.id)
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
    let items = []

    if (liveItem) {
      items = [
        { i18nKey: 'Play', key: _playKey },
        { i18nKey: 'Share', key: _shareKey }
      ]
    } else {
      items = [
        { i18nKey: 'Play', key: _playKey },
        { i18nKey: 'Queue Next', key: _queueNextKey },
        { i18nKey: 'Queue Last', key: _queueLastKey },
        { i18nKey: 'Add to Playlist', key: _addToPlaylistKey },
        { i18nKey: 'Share', key: _shareKey }
      ]
    }

    if (!mediaRef && !liveItem) {
      if (completed) {
        items.push({ i18nKey: 'Mark as Unplayed', key: _markAsUnplayedKey })
      } else {
        items.push({ i18nKey: 'Mark as Played', key: _markAsPlayedKey })
      }
    }

    if (isLoggedInUserMediaRef) {
      items.push({ i18nKey: 'Edit Clip', key: _editClip })
      items.push({ i18nKey: 'Delete Clip', key: _deleteClip })
    }

    return items
  }

  const dropdownItems = generateDropdownItems()
  const isCurrentlyPlayingItem = playerCheckIfItemIsCurrentlyPlaying(player.paused, nowPlayingItem)
  const togglePlayIcon = isCurrentlyPlayingItem ? faPause : faPlay
  const togglePlayClassName = isCurrentlyPlayingItem ? 'pause' : 'play'
  let togglePlayAriaLabel = isCurrentlyPlayingItem ? t('Pause this episode') : t('Play this episode')
  const isClip = !!mediaRef
  if (isClip) {
    togglePlayAriaLabel = isCurrentlyPlayingItem ? t('Pause this clip') : t('Play this clip')
  }
  if (isChapter) {
    togglePlayAriaLabel = isCurrentlyPlayingItem ? t('Pause this chapter') : t('Play this chapter')
  }

  return (
    <>
      <div className='mobile-media-item-controls-above-wrapper'>
        {liveItem && <LiveStatusBadge hideAboveMobileWidth liveItemStatus={liveItem.status} />}
      </div>
      <div className='media-item-controls'>
        {!isLiveItemNotLive && (
          <ButtonCircle
            ariaLabel={togglePlayAriaLabel}
            ariaPressed
            className={togglePlayClassName}
            faIcon={togglePlayIcon}
            onClick={_handleTogglePlay}
            size={isChapter ? 'small' : buttonSize}
          />
        )}
        <div aria-hidden='true' className={timeWrapperClass}>
          {liveItem && !isLiveItemNotLive && <LiveStatusBadge hideBelowMobileWidth liveItemStatus={liveItem.status} />}
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
        {!isChapter && !isLiveItemNotLive && (
          <Dropdown
            dropdownAriaLabel={t('More')}
            dropdownWidthClass='width-medium'
            faIcon={faEllipsisH}
            hasClipEditButtons={dropdownItems.length > 6}
            hideCaret
            onChange={onChange}
            options={dropdownItems}
          />
        )}
      </div>
    </>
  )
}
