import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { convertNowPlayingItemClipToNowPlayingItemEpisode } from 'podverse-shared'
import { addOrUpdateHistoryItemOnServer } from '../userHistoryItem'
import { playerGetDuration, playerGetPosition, playerLoadNowPlayingItem, playerPause } from './player'

let clipEndTimeListenerInterval = null

export const handlePlayAfterClipEndTimeReached = () => {
  const clipHasReachedEnd = OmniAural.state.player.clipHasReachedEnd.value()
  if (clipHasReachedEnd) {
    const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
    OmniAural.setClipHasReachedEnd(false)
    const currentPosition = playerGetPosition()
    if (currentPosition > currentNowPlayingItem.clipEndTime) {
      const episodeNowPlayingItem = convertNowPlayingItemClipToNowPlayingItemEpisode(
        currentNowPlayingItem
      ) as NowPlayingItem
      const shouldPlay = true
      playerLoadNowPlayingItem(episodeNowPlayingItem, shouldPlay)

      /*
        We have to call addOrUpdateHistory here because the onLoadedMetadata event
        will not trigger on resume after the clip's end time reached.
        Also because we need to add the converted episode version
        of the nowPlayingItem to userHistoryItems.
      */
      addOrUpdateHistoryItemOnServer({
        nowPlayingItem: currentNowPlayingItem,
        playbackPosition: playerGetPosition(),
        mediaFileDuration: playerGetDuration(),
        forceUpdateOrderDate: true,
        skipSetNowPlaying: false
      })
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
