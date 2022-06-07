import OmniAural from 'omniaural'
import {
  checkIfVideoFileOrVideoLiveType,
  extractSelectedEnclosureSourceAndContentType,
  NowPlayingItem
} from 'podverse-shared'
import { checkIfNowPlayingItemIsAClip } from './player'
import { handleSetupClipListener } from './playerClip'

// TODO: add the PlayerVideo type
let PVPlayerVideo: any = null

export const videoInitialize = () => {
  if (typeof window === 'undefined') {
    return null
  }

  PVPlayerVideo = window?.playerVideo
}

export const videoIsLoaded = () => {
  const videoSrc = OmniAural.state.player.video.src.value()
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  const alternateEnclosureSelectedIndex = OmniAural.state.player.alternateEnclosureSelectedIndex.value()
  const alternateEnclosureSourceSelectedIndex = OmniAural.state.player.alternateEnclosureSourceSelectedIndex.value()
  const result = extractSelectedEnclosureSourceAndContentType(
    currentNowPlayingItem,
    alternateEnclosureSelectedIndex,
    alternateEnclosureSourceSelectedIndex
  )
  return checkIfVideoFileOrVideoLiveType(result.contentType) && videoSrc
}

export const videoCheckIfCurrentlyPlaying = () => {
  return videoIsLoaded() && !PVPlayerVideo?.paused
}

export const videoGetDuration = () => {
  return PVPlayerVideo?.getDuration() || 0
}

export const videoGetPosition = () => {
  return PVPlayerVideo?.getCurrentTime() || 0
}

export const videoPause = () => {
  OmniAural.pausePlayer()
}

export const videoPlay = () => {
  OmniAural.playPlayer()
}

export const videoSeekTo = (position: number) => {
  PVPlayerVideo.seekTo(position)
}

export const videoSetPlaybackSpeed = (newSpeed: number) => {
  OmniAural.setPlaySpeed(newSpeed)
}

export const videoClearNowPlayingItem = () => {
  OmniAural.playerSetVideoSrc('')
}

export const videoLoadNowPlayingItem = async (
  nowPlayingItem: NowPlayingItem,
  previousNowPlayingItem: NowPlayingItem,
  shouldPlay: boolean,
  alternateEnclosureSelectedIndex?: number,
  alternateEnclosureSourceSelectedIndex?: number
) => {
  videoPause()

  if (
    nowPlayingItem.episodeMediaUrl != previousNowPlayingItem?.episodeMediaUrl ||
    typeof alternateEnclosureSelectedIndex === 'number'
  ) {
    const result = extractSelectedEnclosureSourceAndContentType(
      nowPlayingItem,
      alternateEnclosureSelectedIndex,
      alternateEnclosureSourceSelectedIndex
    )
    OmniAural.playerSetVideoSrc(result.src)
  }

  if (shouldPlay) {
    videoPlay()
  }

  if (checkIfNowPlayingItemIsAClip(nowPlayingItem)) {
    handleSetupClipListener(nowPlayingItem.clipEndTime)
  }

  return nowPlayingItem
}

export const videoSetVolume = () => {
  // handled on global state
}

export const videoMute = () => {
  OmniAural.mutePlayer()
}

export const videoUnmute = () => {
  OmniAural.unmutePlayer()
}
