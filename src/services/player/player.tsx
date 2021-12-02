import OmniAural, { useOmniAural } from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { PV } from '~/resources'
import { addOrUpdateHistoryItemOnServer } from '../userHistoryItem'
import { getNextFromQueue, getQueueItemsFromServer } from '../userQueueItem'
import { audioCheckIfCurrentlyPlaying, audioClearNowPlayingItem, audioGetDuration,
  audioGetPosition, audioIsLoaded, audioLoadNowPlayingItem, audioMute, audioPause,
  audioPlay, audioSeekTo, audioSetPlaybackSpeed, audioSetVolume,
  audioUnmute } from './playerAudio'
import { clearChapterUpdateInterval, getChapterNext, getChapterPrevious } from './playerChapters'
import { clearClipEndTimeListenerInterval, handlePlayAfterClipEndTimeReached, handleSetupClipListener } from './playerClip'
import { setClipFlagPositions } from './playerFlags'
import { checkIfVideoFileType, videoIsLoaded } from './playerVideo'

export const playerCheckIfCurrentlyPlayingItem = (paused: boolean, nowPlayingItem?: NowPlayingItem) => {
  // TODO: @Mitch Downy this hook usage is against "Rule of Hooks", specificially "Don’t call Hooks inside loops, conditions, or nested functions"
  // eslint-disable-next-line
  const [currentNowPlayingItem] = useOmniAural('player.currentNowPlayingItem')
  let isCurrentlyPlayingItem = false

  if (paused) {
    // do nothing
  } else if (
    nowPlayingItem?.clipId
    && nowPlayingItem.clipId === currentNowPlayingItem?.clipId
  ) {
    isCurrentlyPlayingItem = true
  } else if (
    !nowPlayingItem?.clipId
    && nowPlayingItem.episodeId === currentNowPlayingItem?.episodeId
  ) {
    isCurrentlyPlayingItem = true
  }

  return isCurrentlyPlayingItem
}

export const playerCheckIfCurrentlyPlaying = () => {
  let isCurrentlyPlaying = false
  if (audioCheckIfCurrentlyPlaying()) {
    isCurrentlyPlaying = true
  } else if (false) {
    // handle video
    isCurrentlyPlaying = true
  }
  return isCurrentlyPlaying
}

export const playerTogglePlayOrLoadNowPlayingItem = async (
  nowPlayingItem: NowPlayingItem
) => {
  const previousNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  if (
    previousNowPlayingItem
    && previousNowPlayingItem.episodeMediaUrl === nowPlayingItem.episodeMediaUrl
    && nowPlayingItem.clipId && previousNowPlayingItem.clipId !== nowPlayingItem.clipId
  ) {
    playerSeekTo(nowPlayingItem.clipStartTime)
    const shouldPlay = true
    await playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
    const duration = playerGetDuration()
    setClipFlagPositions(nowPlayingItem, duration)
  } else if (
    previousNowPlayingItem
    && previousNowPlayingItem.episodeMediaUrl === nowPlayingItem.episodeMediaUrl
  ) {
    playerCheckIfCurrentlyPlaying() ? playerPause() : playerPlay()
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
    // videoTogglePlay()
  }
}

export const playerPause = () => {
  OmniAural.pausePlayer()
  if (audioIsLoaded()) {
    audioPause()
  } else if (videoIsLoaded()) {
    // videoTogglePlay()
  }
  saveCurrentPlaybackPositionToHistory() // run in the background without await
}

export const playerJumpBackward = () => {
  const seconds = 10
  const position = playerGetPosition()
  const newPosition = position - seconds
  playerSeekTo(newPosition)
  return newPosition
}

export const playerJumpForward = () => {
  const seconds = 30
  const position = playerGetPosition()
  const newPosition = position + seconds
  playerSeekTo(newPosition)
  return newPosition
}

export const playerJumpMiniBackwards = () => {
  const seconds = 1
  const position = playerGetPosition()
  const newPosition = position - seconds
  playerSeekTo(newPosition)
  return newPosition
}

export const playerJumpMiniForwards = () => {
  const seconds = 1
  const position = playerGetPosition()
  const newPosition = position + seconds
  playerSeekTo(newPosition)
  return newPosition
}

export const playerGetDuration = () => {
  let duration = 0
  if (audioIsLoaded()) {
    duration = audioGetDuration()
  } else if (videoIsLoaded()) {
    // duration = videoGetPosition()
  }
  return duration
}

export const playerGetPosition = () => {
  if (audioIsLoaded()) {
    return audioGetPosition()
  } else if (videoIsLoaded()) {
    // return videoGetPosition()
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
    // videoSeekTo(position)
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
    // videoSetPlaybackSpeed(newSpeed)
  }
}

export const playerSetVolume = (newVolume: number) => {
  OmniAural.playerSetVolume(newVolume)

  if (newVolume >= 1) {
    playerUnmute()
  }

  if (audioIsLoaded()) {
    audioSetVolume(newVolume)
  } else if (videoIsLoaded()) {
    // videoSetVolume(newSpeed)
  }
}

export const playerMute = () => {
  OmniAural.mutePlayer()
  if (audioIsLoaded()) {
    audioMute()
  } else if (videoIsLoaded()) {
    //
  }
}

export const playerUnmute = () => {
  OmniAural.unmutePlayer()
  if (audioIsLoaded()) {
    audioUnmute()
  } else if (videoIsLoaded()) {
    //
  }
}

export const playerLoadNowPlayingItem = async (
  nowPlayingItem: NowPlayingItem,
  shouldPlay: boolean
) => {
  try {
    if (!nowPlayingItem) return
    // Save the previous item's playback position to history.
    saveCurrentPlaybackPositionToHistory()

    // Create a variable for the previous item for later.
    const previousNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()

    // Set the NEW nowPlayingItem on the player state.
    OmniAural.setPlayerItem(nowPlayingItem)

    // Clear all remnants of the previous item from state and the player.
    // Do this after the setPlayerItem so there isn't a flash of no content.
    playerClearPreviousItem(nowPlayingItem)
  
    if (!checkIfVideoFileType(nowPlayingItem)) {
      // audioAddNowPlayingItemNextInQueue(item, itemToSetNextInQueue)
    }

    // const skipSetNowPlaying = true
    // await playerUpdateUserPlaybackPosition(skipSetNowPlaying)

    if (checkIfVideoFileType(nowPlayingItem)) {
      // await videoLoadNowPlayingItem(
      //   item,
      //   shouldPlay,
      //   forceUpdateOrderDate,
      //   previousNowPlayingItem
      // )
    } else {
      await audioLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
    }

    if (checkIfNowPlayingItemIsAClip(nowPlayingItem)) {
      handleSetupClipListener(nowPlayingItem.clipEndTime)
    }
  } catch (error) {
    console.log('playerLoadNowPlayingItem service error', error)
  }

  const newUserQueueItems = await getQueueItemsFromServer()
  OmniAural.setUserQueueItems(newUserQueueItems)
}

/* Reset the state, intervals, and  related to the nowPlayingItem in state  */
const playerClearPreviousItem = (nextNowPlayingItem: NowPlayingItem) => {
  playerClearPreviousItemState()
  playerClearTimeIntervals()
  playerClearItemFromPlayerAPI(nextNowPlayingItem)
}

const playerClearPreviousItemState = () => {
  OmniAural.setChapterFlagPositions([])
  OmniAural.setChapters([])
  OmniAural.setClipFlagPositions([])
  OmniAural.setClipHasReachedEnd(false)
  /* The positions get set in the onLoadedMetaData handler in the PlayerAPIs */
  OmniAural.setHighlightedPositions([])
  OmniAural.setPlayerPlaybackPosition(0)
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
  if (checkIfVideoFileType(nextNowPlayingItem)) {
    audioClearNowPlayingItem()
  } else {
    // clear video
  }
}

const checkIfNowPlayingItemIsAClip = (nowPlayingItem: NowPlayingItem) =>
  nowPlayingItem.clipStartTime
    && nowPlayingItem.clipEndTime
    && !nowPlayingItem.clipIsOfficialChapter

export const saveCurrentPlaybackPositionToHistory = async () => {
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const position = playerGetPosition()
  const duration = playerGetDuration()
  const forceUpdateOrderDate = false
  const skipSetNowPlaying = false
  await addOrUpdateHistoryItemOnServer(
    currentNowPlayingItem,
    position,
    duration,
    forceUpdateOrderDate,
    skipSetNowPlaying
  )
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
  if (!!nextNowPlayingItem) {
    const shouldPlay = true
    playerLoadNowPlayingItem(nextNowPlayingItem, shouldPlay)
  }
}
