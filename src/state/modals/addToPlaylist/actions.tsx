import OmniAural from "omniaural"
import { NowPlayingItem } from "podverse-shared"

const modalsAddToPlaylistHide = () => {
  OmniAural.state.modals.addToPlaylist.item.set(null)
}

const modalsAddToPlaylistShow = (item: NowPlayingItem) => {
  OmniAural.state.modals.addToPlaylist.item.set(item)
}

OmniAural.addActions({ modalsAddToPlaylistHide, modalsAddToPlaylistShow })
