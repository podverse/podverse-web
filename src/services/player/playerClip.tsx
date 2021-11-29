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
      handleSetupClipListener(currentNowPlayingItem.clipEndTime)
    }
  }
}

export const clearClipEndTimeListenerInterval = () => {
  if (clipEndTimeListenerInterval) {
    clearInterval(clipEndTimeListenerInterval)
  }
}

const checkIfClipEndTimeReached = (clipEndTime: number) => {
  const currentPosition = playerGetPosition()
  if (currentPosition > clipEndTime) {
    clearClipEndTimeListenerInterval()
    OmniAural.setClipHasReachedEnd(true)
    playerPause()
  }
}

export const handleSetupClipListener = (clipEndTime?: number) => {
  if (clipEndTime) {
    clipEndTimeListenerInterval = setInterval(() => {
      checkIfClipEndTimeReached(clipEndTime)
    }, 333)
  }
}
