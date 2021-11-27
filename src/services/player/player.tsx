import OmniAural, { useOmniAural } from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { PlayerFlagTime } from '~/lib/types'
import { PV } from '~/resources'
import { audioCheckIfCurrentlyPlaying, audioClearNowPlayingItem, audioGetDuration, audioGetPosition, audioIsLoaded, audioLoadNowPlayingItem, audioMute, audioPause, audioPlay, audioSeekTo, audioSetPlaybackSpeed, audioSetVolume, audioTogglePlay, audioUnmute } from './playerAudio'
import { checkIfVideoFileType, videoIsLoaded } from './playerVideo'

let clipEndTimeListenerInterval = null

export const playerCheckIfCurrentlyPlayingItem = (paused: boolean, nowPlayingItem?: NowPlayingItem) => {
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
  ) {
    playerCheckIfCurrentlyPlaying() ? playerPause() : playerPlay()
  } else {
    const shouldPlay = true
    await playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
  }
}

export const playerClearLoadedItems = () => {
  audioClearNowPlayingItem()
  // clear video
}

export const playerPlay = () => {
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
  shouldPlay?: boolean
) => {
  try {
    if (!nowPlayingItem) return

    // clearClipEndTimeListenerInterval()

    // const previousNowPlayingItem = OmniAural.state.player.nowPlayingItem.value()

    OmniAural.setPlayerItem(nowPlayingItem)

    playerClearLoadedItems()

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
      await audioLoadNowPlayingItem(nowPlayingItem, shouldPlay)
    }

    if (nowPlayingItem.clipStartTime && !nowPlayingItem.clipIsOfficialChapter) {
      handleSetupClip(nowPlayingItem)
    }

  } catch (error) {
    console.log('playerLoadNowPlayingItem service error', error)
  }
}

const handleSetupClip = (nowPlayingItem: NowPlayingItem) => {
  clipEndTimeListenerInterval = setInterval(() => {
    checkIfEndTimeReached(nowPlayingItem)
  }, 333)
}

const checkIfEndTimeReached = (nowPlayingItem: NowPlayingItem) => {
  const currentPosition = playerGetPosition()
  if (nowPlayingItem.clipEndTime && currentPosition > nowPlayingItem.clipEndTime) {
    clearClipEndTimeListenerInterval()
    playerPause()
  }
}

const clearClipEndTimeListenerInterval = () => {
  if (clipEndTimeListenerInterval) {
    clearInterval(clipEndTimeListenerInterval)
  }
}

export const generateFlagPositions = (
  flagTimes: number[],
  duration: number
) => {
  const flagPositions: number[] = []
  for (const flagTime of flagTimes) {
    const flagPosition = flagTime / duration
    if (flagPosition >= 0 || flagPosition <= 1) {
      flagPositions.push(flagPosition)
    }
  }
  return flagPositions
}

export const generateChapterFlagPositions = (
  chapters: any[],
  duration: number
) => {
  console.log('generateChapterFlagPositions')
}

export const generateClipFlagPositions = (
  nowPlayingItem: NowPlayingItem,
  duration: number
) => {
  const flagTimes: number[] = [nowPlayingItem.clipStartTime]

  if (nowPlayingItem.clipEndTime) {
    flagTimes.push(nowPlayingItem.clipEndTime)
  }

  return generateFlagPositions(flagTimes, duration)
}
