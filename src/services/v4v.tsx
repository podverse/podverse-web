import { NowPlayingItem } from 'podverse-shared'

if (typeof window !== 'undefined') {
  window.__v4v = {
    currentPage: {
      item: null
    },
    playerInfo: {
      item: null,
      playbackPosition: 0
    }
  }
}

export const setV4VCurrentPageItemToWindow = (nowPlayingItem: NowPlayingItem | null) => {
  if (typeof window !== 'undefined') {
    window.__v4v.currentPage.item = nowPlayingItem
  }
}

export const setV4VPlayerInfoItemToWindow = (nowPlayingItem: NowPlayingItem | null) => {
  if (typeof window !== 'undefined') {
    window.__v4v.playerInfo.item = nowPlayingItem
  }
}

export const setV4VPlayerInfoPlaybackPositionToWindow = (playbackPosition = 0) => {
  if (typeof window !== 'undefined') {
    window.__v4v.playerInfo.playbackPosition = playbackPosition
  }
}
