import OmniAural from "omniaural"
import { NowPlayingItem } from "podverse-shared"

const modalsShareHide = () => {
  OmniAural.state.modals.share.item.set(null)
}

const modalsShareShow = (item: NowPlayingItem) => {
  OmniAural.state.modals.share.item.set(item)
}

OmniAural.addActions({ modalsShareHide, modalsShareShow })
