import OmniAural from "omniaural"
import type { Episode, Podcast, MediaRef } from "podverse-shared"
import { convertToNowPlayingItem } from "podverse-shared"
// Implement any custom player OmniAural actions here

const togglePlayer = (show: boolean) => {
  OmniAural.state.player.show.set(show)
}

const setPlayerItem = (
  item: Episode | Podcast | MediaRef,
  options?: {
    inheritedEpisode?: Episode | null
    inheritedPodcast?: Podcast | null
    userPlaybackPosition?: number
  }
) => {
  const {
    inheritedEpisode = null,
    inheritedPodcast = null,
    userPlaybackPosition = 0,
  } = options || {}
  const nowPlayingItem = convertToNowPlayingItem(
    item,
    inheritedEpisode,
    inheritedPodcast,
    userPlaybackPosition
  )
  OmniAural.state.player.nowPlayingItem.set(nowPlayingItem)
  OmniAural.state.player.show.set(true)
}

const mutePlayer = () => {
  OmniAural.state.player.muted.set(true)
}

const unmutePlayer = () => {
  OmniAural.state.player.muted.set(false)
}

OmniAural.addActions({ togglePlayer, setPlayerItem, mutePlayer, unmutePlayer })
