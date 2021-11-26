import OmniAural from "omniaural"
import type { NowPlayingItem } from "podverse-shared"

const togglePlayer = (show: boolean) => {
  OmniAural.state.player.show.set(show)
}

const setPlayerItem = (currentNowPlayingItem: NowPlayingItem) => {
  OmniAural.state.player.currentNowPlayingItem.set(currentNowPlayingItem)
  OmniAural.state.player.show.set(true)
}

const pausePlayer = () => {
  OmniAural.state.player.paused.set(true)
}

const playPlayer = () => {
  OmniAural.state.player.paused.set(false)
}

const mutePlayer = () => {
  OmniAural.state.player.muted.set(true)
}

const unmutePlayer = () => {
  OmniAural.state.player.muted.set(false)
}

OmniAural.addActions({ mutePlayer, pausePlayer, playPlayer,
  setPlayerItem, togglePlayer, unmutePlayer })
