import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { checkIfVideoFileOrVideoLiveType, extractSelectedEnclosureSourceAndContentType } from 'podverse-shared'
import { checkIfNowPlayingItemIsAClip } from './player'
import { handleSetupClipListener } from './playerClip'

let PVPlayerAudio: HTMLAudioElement = null

export const audioInitialize = () => {
  if (typeof window === 'undefined') {
    return null
  }

  PVPlayerAudio = window?.playerAudio?.current?.audio?.current
}

export const audioIsLoaded = () => {
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const alternateEnclosureSelectedIndex = OmniAural.state.player.alternateEnclosureSelectedIndex.value()
  const alternateEnclosureSourceSelectedIndex = OmniAural.state.player.alternateEnclosureSourceSelectedIndex.value()
  const result = extractSelectedEnclosureSourceAndContentType(
    currentNowPlayingItem,
    alternateEnclosureSelectedIndex,
    alternateEnclosureSourceSelectedIndex
  )
  return !checkIfVideoFileOrVideoLiveType(result.contentType)
}

export const audioCheckIfCurrentlyPlaying = () => {
  return audioIsLoaded() && !PVPlayerAudio?.paused && PVPlayerAudio?.currentTime > 0 && !PVPlayerAudio.ended
}

export const audioGetDuration = () => {
  // Sometimes PVPlayerAudio.duration returns NaN, so default to 0.
  return PVPlayerAudio.duration || 0
}

export const audioGetPosition = () => {
  return PVPlayerAudio.currentTime
}

export const audioPause = () => {
  OmniAural.pausePlayer()
  PVPlayerAudio.pause()
  OmniAural.playerIsNotAtCurrentLiveStreamTime()
}

export const audioPlay = () => {
  const isInitialLoad = OmniAural.state.player.isInitialLoad.value()
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const isLiveItem = !!currentNowPlayingItem?.liveItem
  if (isLiveItem && isInitialLoad) {
    audioResetLiveItemAndResumePlayback(currentNowPlayingItem.episodeMediaUrl)
  } else {
    OmniAural.playPlayer()
    PVPlayerAudio.play()
  }
  OmniAural.playerIsNotInitialLoad()
}

export const audioSeekTo = (position: number) => {
  PVPlayerAudio.currentTime = position
  OmniAural.playerIsNotAtCurrentLiveStreamTime()
}

export const audioSetPlaybackSpeed = (newSpeed: number) => {
  PVPlayerAudio.playbackRate = newSpeed
}

export const audioClearNowPlayingItem = () => {
  PVPlayerAudio.src = ''
}

export const audioLoadNowPlayingItem = async (
  nowPlayingItem: NowPlayingItem,
  previousNowPlayingItem?: NowPlayingItem,
  shouldPlay?: boolean,
  alternateEnclosureSelectedIndex?: number,
  alternateEnclosureSourceSelectedIndex?: number
) => {
  PVPlayerAudio.pause()

  if (
    nowPlayingItem.episodeMediaUrl != previousNowPlayingItem?.episodeMediaUrl ||
    typeof alternateEnclosureSelectedIndex === 'number'
  ) {
    const result = extractSelectedEnclosureSourceAndContentType(
      nowPlayingItem,
      alternateEnclosureSelectedIndex,
      alternateEnclosureSourceSelectedIndex
    )
    PVPlayerAudio.src = result.src
  }

  if (shouldPlay) {
    audioPlay()
  }

  if (checkIfNowPlayingItemIsAClip(nowPlayingItem)) {
    handleSetupClipListener(nowPlayingItem.clipEndTime)
  }

  const isLiveItem = !!nowPlayingItem.liveItem
  if (isLiveItem && shouldPlay) {
    OmniAural.playerIsAtCurrentLiveStreamTime()
  }

  return nowPlayingItem
}

export const audioSetVolume = (newVolume: number) => {
  PVPlayerAudio.volume = newVolume / 100
}

export const audioMute = () => {
  PVPlayerAudio.muted = true
}

export const audioUnmute = () => {
  PVPlayerAudio.muted = false
}

/*
  Apparently the only way to force a live stream to play from the latest time
  is to remove and reload the live stream in the player.
  https://stackoverflow.com/questions/27258169/how-can-i-stop-and-resume-a-live-audio-stream-in-html5-instead-of-just-pausing-i
*/
export const audioResetLiveItemAndResumePlayback = (liveStreamSrc: string) => {
  const audioElement = window?.playerAudio?.current?.audio?.current
  audioElement?.setAttribute('src', '')
  audioElement?.pause()
  setTimeout(() => {
    audioElement?.load()
    setTimeout(() => {
      audioElement?.setAttribute('src', liveStreamSrc)
      audioElement?.load()
      audioPlay()
      OmniAural.playerIsAtCurrentLiveStreamTime()
    }, 500)
  }, 100)
}
