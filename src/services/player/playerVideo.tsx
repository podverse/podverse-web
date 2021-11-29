import type { NowPlayingItem } from 'podverse-shared'

export const checkIfVideoFileType = (nowPlayingItem?: NowPlayingItem) => {
  return nowPlayingItem?.episodeMediaType && nowPlayingItem.episodeMediaType.indexOf('video') >= 0
}

export const videoIsLoaded = async () => {
  // return !!PVPlayerVideo.src
  return false
}
