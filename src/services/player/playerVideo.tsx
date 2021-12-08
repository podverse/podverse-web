import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'

// TODO: add the PlayerVideo type
let PVPlayerVideo: any = null

export const videoInitialize = () => {
  if (typeof window === 'undefined') {
    return null
  }

  PVPlayerVideo = window?.playerVideo
}

export const checkIfVideoFileType = (nowPlayingItem?: NowPlayingItem) => {
  return nowPlayingItem?.episodeMediaType && nowPlayingItem.episodeMediaType.indexOf('video') >= 0
}

export const videoIsLoaded = () => {
  const videoSrc = OmniAural.state.player.video.src.value()
  const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
  return checkIfVideoFileType(currentNowPlayingItem) && videoSrc
}

export const videoCheckIfCurrentlyPlaying = () => {
  return !PVPlayerVideo?.paused
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
  shouldPlay: boolean
) => {
  videoPause()

  if (nowPlayingItem.episodeMediaUrl != previousNowPlayingItem?.episodeMediaUrl) {
    OmniAural.playerSetVideoSrc(nowPlayingItem.episodeMediaUrl)
  }

  if (shouldPlay) {
    videoPlay()
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
