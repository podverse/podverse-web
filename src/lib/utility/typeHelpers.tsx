import { Episode, MediaRef, NowPlayingItem } from 'podverse-shared'

export function isEpisode (
  episodeOrMediaRef: Episode | MediaRef
): episodeOrMediaRef is Episode {
  return "pubDate" in episodeOrMediaRef
}

export function isMediaRef(
  episodeOrMediaRef: Episode | MediaRef
): episodeOrMediaRef is MediaRef {
  return "startTime" in episodeOrMediaRef
}

export function isNowPlayingItemMediaRef(
  episodeOrMediaRef: NowPlayingItem
): episodeOrMediaRef is MediaRef {
  return "clipId" in episodeOrMediaRef
}
