import OmniAural from 'omniaural'
import { NowPlayingItem } from 'podverse-shared'

const modalsAddToPlaylistHide = () => {
  OmniAural.state.modals.addToPlaylist.item.set(null)
}

const modalsAddToPlaylistShow = (item: NowPlayingItem) => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.addToPlaylist.item.set(item)
}

OmniAural.addActions({ modalsAddToPlaylistHide, modalsAddToPlaylistShow })

export const modalsAddToPlaylistShowOrAlert = (nowPlayingItem: NowPlayingItem) => {
  const userInfo = OmniAural.state.session.userInfo.value()
  if (userInfo) {
    OmniAural.modalsAddToPlaylistShow(nowPlayingItem)
  } else {
    OmniAural.modalsLoginToAlertShow('add item to playlist')
  }
}
