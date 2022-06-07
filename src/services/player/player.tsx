import OmniAural from 'omniaural'
import {
  checkIfVideoFileOrVideoLiveType,
  extractSelectedEnclosureSourceAndContentType,
  NowPlayingItem
} from 'podverse-shared'
import { unstable_batchedUpdates } from 'react-dom'
import { PV } from '~/resources'
import { addOrUpdateHistoryItemOnServer } from '../userHistoryItem'
import { getNextFromQueue, getQueueItemsFromServer } from '../userQueueItem'
import {
  audioClearNowPlayingItem,
  audioGetDuration,
  audioGetPosition,
  audioIsLoaded,
  audioLoadNowPlayingItem,
  audioMute,
  audioPause,
  audioPlay,
  audioResetLiveItemAndResumePlayback,
  audioSeekTo,
  audioSetPlaybackSpeed,
  audioSetVolume,
  audioUnmute
} from './playerAudio'
import { clearChapterUpdateInterval, getChapterNext, getChapterPrevious } from './playerChapters'
import { clearClipEndTimeListenerInterval, handlePlayAfterClipEndTimeReached } from './playerClip'
import { setClipFlagPositions } from './playerFlags'
import {
  videoClearNowPlayingItem,
  videoGetDuration,
  videoGetPosition,
  videoIsLoaded,
  videoLoadNowPlayingItem,
  videoMute,
  videoPause,
  videoPlay,
  videoSeekTo,
  videoSetPlaybackSpeed,
  videoUnmute
} from './playerVideo'

export const playerCheckIfItemIsCurrentlyPlaying = (paused: boolean, nowPlayingItem?: NowPlayingItem) => {
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  let isCurrentlyPlayingItem = false

  if (paused) {
    // do nothing
  } else if (nowPlayingItem?.clipId && nowPlayingItem.clipId === currentNowPlayingItem?.clipId) {
    isCurrentlyPlayingItem = true
  } else if (!nowPlayingItem?.clipId && nowPlayingItem.episodeId === currentNowPlayingItem?.episodeId) {
    isCurrentlyPlayingItem = true
  }

  return isCurrentlyPlayingItem
}

export const playerTogglePlayOrLoadNowPlayingItem = async (nowPlayingItem: NowPlayingItem) => {
  const previousNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const paused = OmniAural.state.player.paused.value()

  if (
    previousNowPlayingItem &&
    previousNowPlayingItem.episodeMediaUrl === nowPlayingItem.episodeMediaUrl &&
    nowPlayingItem.clipId &&
    previousNowPlayingItem.clipId !== nowPlayingItem.clipId
  ) {
    playerSeekTo(nowPlayingItem.clipStartTime)
    const shouldPlay = true
    const isChapter = true
    await playerLoadNowPlayingItem(nowPlayingItem, shouldPlay, isChapter)
    const duration = playerGetDuration()
    setClipFlagPositions(nowPlayingItem, duration)
  } else if (previousNowPlayingItem && previousNowPlayingItem.episodeMediaUrl === nowPlayingItem.episodeMediaUrl) {
    paused ? playerPlay() : playerPause()
  } else {
    const shouldPlay = true
    await playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
  }
}

export const playerPlay = () => {
  handlePlayAfterClipEndTimeReached()

  if (audioIsLoaded()) {
    audioPlay()
  } else if (videoIsLoaded()) {
    videoPlay()
  }
}

export const playerPause = () => {
  OmniAural.pausePlayer()
  if (audioIsLoaded()) {
    audioPause()
  } else if (videoIsLoaded()) {
    videoPause()
  }
  saveCurrentPlaybackPositionToHistory() // run in the background without await
}

const playerJump = (seconds: number) => {
  const position = playerGetPosition()
  const newPosition = position + seconds
  playerSeekTo(newPosition)
  return newPosition
}

export const playerJumpBackward = () => playerJump(-10)

export const playerJumpForward = () => playerJump(30)

export const playerJumpMiniBackwards = () => playerJump(-1)

export const playerJumpMiniForwards = () => playerJump(1)

export const playerGetDuration = () => {
  let duration = 0
  if (audioIsLoaded()) {
    duration = audioGetDuration()
  } else if (videoIsLoaded()) {
    duration = videoGetDuration()
  }
  return duration
}

export const playerGetPosition = () => {
  if (audioIsLoaded()) {
    return audioGetPosition()
  } else if (videoIsLoaded()) {
    return videoGetPosition()
  }
}

export const playerUpdatePlaybackPosition = () => {
  const newPosition = playerGetPosition()
  OmniAural.setPlayerPlaybackPosition(newPosition)
}

export const playerUpdateDuration = () => {
  const newDuration = playerGetDuration()
  OmniAural.setPlayerDuration(newDuration)
}

export const playerSeekTo = (position: number) => {
  OmniAural.setPlayerPlaybackPosition(position)
  if (audioIsLoaded()) {
    audioSeekTo(position)
  } else if (videoIsLoaded()) {
    videoSeekTo(position)
  }
}

export const playerNextSpeed = () => {
  const currentSpeed = OmniAural.state.player.playSpeed.value()
  const currentIndex = PV.Player.speeds.indexOf(currentSpeed)

  let newSpeed
  if (PV.Player.speeds.length - 1 === currentIndex) {
    newSpeed = PV.Player.speeds[0]
  } else {
    newSpeed = PV.Player.speeds[currentIndex + 1]
  }

  playerSetPlaybackSpeed(newSpeed)
}

export const playerSetPlaybackSpeed = (newSpeed: number) => {
  OmniAural.setPlaySpeed(newSpeed)
  if (audioIsLoaded()) {
    audioSetPlaybackSpeed(newSpeed)
  } else if (videoIsLoaded()) {
    videoSetPlaybackSpeed(newSpeed)
  }
}

const playerGetCurrentPlaybackSpeed = () => {
  const currentSpeed = OmniAural.state.player.playSpeed.value()
  const currentIndex = PV.Player.speeds.indexOf(currentSpeed)
  const playSpeed = PV.Player.speeds[currentIndex]
  return playSpeed
}

export const playerSetVolume = (newVolume: number) => {
  OmniAural.playerSetVolume(newVolume)

  if (newVolume >= 1) {
    playerUnmute()
  }

  if (audioIsLoaded()) {
    audioSetVolume(newVolume)
  } else if (videoIsLoaded()) {
    // videoSetVolume(newVolume) // not needed
  }
}

export const playerMute = () => {
  OmniAural.mutePlayer()
  if (audioIsLoaded()) {
    audioMute()
  } else if (videoIsLoaded()) {
    videoMute()
  }
}

export const playerUnmute = () => {
  OmniAural.unmutePlayer()
  if (audioIsLoaded()) {
    audioUnmute()
  } else if (videoIsLoaded()) {
    videoUnmute()
  }
}

/*
  Apparently the only way to force a live stream to play from the latest time
  is to remove and reload the live stream in the player.
  https://stackoverflow.com/questions/27258169/how-can-i-stop-and-resume-a-live-audio-stream-in-html5-instead-of-just-pausing-i
*/
export const playerResetLiveItemAndResumePlayback = () => {
  const isAudio = true
  if (isAudio) {
    const liveStreamSrc = window?.playerAudio?.current?.audio?.current?.currentSrc
    audioResetLiveItemAndResumePlayback(liveStreamSrc)
  }
}

export const playerLoadNowPlayingItem = async (
  nowPlayingItem: NowPlayingItem,
  shouldPlay: boolean,
  isChapter?: boolean,
  alternateEnclosureSelectedIndex?: number,
  alternateEnclosureSourceSelectedIndex?: number
) => {
  try {
    if (!nowPlayingItem) return

    if (
      typeof alternateEnclosureSelectedIndex !== 'number' ||
      typeof alternateEnclosureSourceSelectedIndex !== 'number'
    ) {
      OmniAural.clearAlternateEnclosureSelectedIndex()
    }

    // Save the previous item's playback position to history.
    unstable_batchedUpdates(() => {
      saveCurrentPlaybackPositionToHistory()
    })

    // Create a variable for the previous item for later.
    const previousNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()

    // Set the NEW nowPlayingItem on the player state.
    unstable_batchedUpdates(() => {
      OmniAural.setPlayerItem(nowPlayingItem)
    })

    // Clear all remnants of the previous item from state and the player.
    // Do this after the setPlayerItem so there isn't a flash of no content.
    if (!isChapter) {
      playerClearPreviousItem(nowPlayingItem)
    }

    const result = extractSelectedEnclosureSourceAndContentType(
      nowPlayingItem,
      alternateEnclosureSelectedIndex,
      alternateEnclosureSourceSelectedIndex
    )
    if (checkIfVideoFileOrVideoLiveType(result.contentType)) {
      await videoLoadNowPlayingItem(
        nowPlayingItem,
        previousNowPlayingItem,
        shouldPlay,
        alternateEnclosureSelectedIndex,
        alternateEnclosureSourceSelectedIndex
      )
    } else {
      await audioLoadNowPlayingItem(
        nowPlayingItem,
        previousNowPlayingItem,
        shouldPlay,
        alternateEnclosureSelectedIndex,
        alternateEnclosureSourceSelectedIndex
      )
    }

    /* Set playback speed right after the item loads, since loading a new item can clear it. */
    const playSpeed = playerGetCurrentPlaybackSpeed()
    playerSetPlaybackSpeed(playSpeed)
  } catch (error) {
    console.log('playerLoadNowPlayingItem service error', error)
  }

  const newUserQueueItems = await getQueueItemsFromServer()
  unstable_batchedUpdates(() => {
    OmniAural.setUserQueueItems(newUserQueueItems)
  })
}

/* Reset the state, intervals, and  related to the nowPlayingItem in state  */
const playerClearPreviousItem = (nextNowPlayingItem: NowPlayingItem) => {
  playerClearPreviousItemState()
  playerClearTimeIntervals()
  playerClearItemFromPlayerAPI(nextNowPlayingItem)
}

const playerClearPreviousItemState = () => {
  unstable_batchedUpdates(() => {
    OmniAural.clearAlternateEnclosureSelectedIndex()
    OmniAural.setChapterFlagPositions([])
    OmniAural.setChapters([])
    OmniAural.setClipFlagPositions([])
    OmniAural.setClipHasReachedEnd(false)
    /* The positions get set in the onLoadedMetaData handler in the PlayerAPIs */
    OmniAural.setHighlightedPositions([])
    OmniAural.setPlayerPlaybackPosition(0)
  })
}

const playerClearTimeIntervals = () => {
  clearClipEndTimeListenerInterval()
  clearChapterUpdateInterval()
}

/*
  If video should play, then clear the src for the audio player, and vice versa.
  Also, clear the previous currentPlayingItem
*/
const playerClearItemFromPlayerAPI = (nextNowPlayingItem: NowPlayingItem) => {
  const result = extractSelectedEnclosureSourceAndContentType(nextNowPlayingItem)
  if (checkIfVideoFileOrVideoLiveType(result.contentType)) {
    audioClearNowPlayingItem()
  } else {
    videoClearNowPlayingItem()
  }
}

export const checkIfNowPlayingItemIsAClip = (nowPlayingItem: NowPlayingItem) =>
  nowPlayingItem.clipStartTime && nowPlayingItem.clipEndTime && !nowPlayingItem.clipIsOfficialChapter

export const saveCurrentPlaybackPositionToHistory = (skipSetNowPlaying = false) => {
  return addOrUpdateHistoryItemOnServer({
    nowPlayingItem: OmniAural.state.player.currentNowPlayingItem.value(),
    mediaFileDuration: playerGetDuration(),
    playbackPosition: playerGetPosition(),
    forceUpdateOrderDate: false,
    skipSetNowPlaying
  })
}

export const playerPlayPreviousChapterOrReturnToBeginningOfTrack = async () => {
  const chapters = OmniAural.state.player.chapters.value()

  if (chapters && chapters.length > 1) {
    const previousChapter = await getChapterPrevious()
    if (previousChapter) {
      await playerSeekTo(previousChapter.startTime)
      return
    }
  }

  await playerSeekTo(0)
}

export const playerPlayNextChapterOrQueueItem = async () => {
  const chapters = OmniAural.state.player.chapters.value()

  if (chapters && chapters.length > 1) {
    const nextChapter = await getChapterNext()
    if (nextChapter) {
      await playerSeekTo(nextChapter.startTime)
      return
    }
  }

  await playerPlayNextFromQueue()
}

export const playerPlayNextFromQueue = async () => {
  const nextNowPlayingItem = await getNextFromQueue()
  if (nextNowPlayingItem) {
    const shouldPlay = true
    playerLoadNowPlayingItem(nextNowPlayingItem, shouldPlay)
  }
}
