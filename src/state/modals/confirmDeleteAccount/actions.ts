import OmniAural from 'omniaural'

const modalsConfirmDeleteAccountHide = () => {
  OmniAural.state.modals.confirmDeleteAccount.show.set(false)
}

const modalsConfirmDeleteAccountShow = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.confirmDeleteAccount.show.set(true)
}

OmniAural.addActions({ modalsConfirmDeleteAccountHide, modalsConfirmDeleteAccountShow })
