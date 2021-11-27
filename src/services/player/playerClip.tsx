import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { convertNowPlayingItemClipToNowPlayingItemEpisode } from 'podverse-shared'
import { playerGetPosition, playerLoadNowPlayingItem, playerPause } from './player'

let clipEndTimeListenerInterval = null

export const handlePlayAfterClipEndTimeReached = () => {
  const clipHasReachedEnd = OmniAural.state.player.clipHasReachedEnd.value()
  if (clipHasReachedEnd) {
    const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
    OmniAural.setClipHasReachedEnd(false)
    const currentPosition = playerGetPosition()
    if (currentPosition > currentNowPlayingItem.clipEndTime) {
      const episodeNowPlayingItem =
        convertNowPlayingItemClipToNowPlayingItemEpisode(currentNowPlayingItem) as NowPlayingItem
      const shouldPlay = true
      playerLoadNowPlayingItem(episodeNowPlayingItem, shouldPlay)
    } else {
      handleSetupClip(currentNowPlayingItem)
    }
  }
}

export const clearClipEndTimeListenerInterval = () => {
  if (clipEndTimeListenerInterval) {
    clearInterval(clipEndTimeListenerInterval)
  }
}

export const checkIfClipEndTimeReached = (nowPlayingItem: NowPlayingItem) => {
  const currentPosition = playerGetPosition()
  if (nowPlayingItem.clipEndTime && currentPosition > nowPlayingItem.clipEndTime) {
    clearClipEndTimeListenerInterval()
    OmniAural.setClipHasReachedEnd(true)
    playerPause()
  }
}

export const handleSetupClip = (nowPlayingItem: NowPlayingItem) => {
  if (nowPlayingItem.clipEndTime) {
    clipEndTimeListenerInterval = setInterval(() => {
      checkIfClipEndTimeReached(nowPlayingItem)
    }, 333)
  }
}
