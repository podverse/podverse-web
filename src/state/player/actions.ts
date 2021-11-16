import OmniAural from "omniaural"
import type {Episode, Podcast, MediaRef} from "podverse-shared"
import {convertToNowPlayingItem} from "podverse-shared"
// Implement any custom player OmniAural actions here

const togglePlayer = (show: boolean) => {
  OmniAural.state.player.show.set(show)
}

OmniAural.addActions({ togglePlayer })
