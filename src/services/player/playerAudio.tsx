import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'

let PVPlayerAudio: HTMLAudioElement = null

export const audioInitialize = () => {
  if (typeof window === 'undefined') {
    return null
  }

  PVPlayerAudio = window?.playerAudio?.current?.audio?.current
}

export const audioIsLoaded = () => {
  return !!PVPlayerAudio?.src
}

export const audioCheckIfCurrentlyPlaying = () => {
  return (
    !PVPlayerAudio?.paused
    && PVPlayerAudio?.currentTime > 0
    && !PVPlayerAudio.ended
  )
}

export const audioGetDuration = () => {
  return PVPlayerAudio.duration
}

export const audioGetPosition = () => {
  return PVPlayerAudio.currentTime
}

export const audioPause = () => {
  OmniAural.pausePlayer()
  PVPlayerAudio.pause()
}

export const audioPlay = () => {
  OmniAural.playPlayer()
  PVPlayerAudio.play()
}

export const audioSeekTo = (position: number) => {
  PVPlayerAudio.currentTime = position
}

export const audioClearNowPlayingItem = () => {
  PVPlayerAudio.src = ''
}

export const audioLoadNowPlayingItem = async (
  item: NowPlayingItem,
  shouldPlay: boolean
) => {

  PVPlayerAudio.pause()

  // const lastPlayingItem = await getNowPlayingItemLocally()
  // const historyItemsIndex = await getHistoryItemsIndexLocally()

  // const { clipId, episodeId } = item
  // if (!clipId && episodeId) {
  //   item.episodeDuration = historyItemsIndex?.episodes[episodeId]?.mediaFileDuration || 0
  // }

  // addOrUpdateHistoryItem(item, item.userPlaybackPosition || 0, item.episodeDuration || 0, forceUpdateOrderDate)

  PVPlayerAudio.src = item.episodeMediaUrl

  if (shouldPlay) {
    audioPlay()
  }

  // if (lastPlayingItem && lastPlayingItem.episodeId && lastPlayingItem.episodeId !== item.episodeId) {
  //   PVEventEmitter.emit(PV.Events.PLAYER_NEW_EPISODE_LOADED)
  // }

  return item
}
