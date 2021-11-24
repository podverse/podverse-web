import OmniAural from "omniaural"

const modalsCheckoutHide = () => {
  OmniAural.state.modals.checkout.show.set(false)
}

const modalsCheckoutShow = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.checkout.show.set(true)
}

OmniAural.addActions({ modalsCheckoutHide, modalsCheckoutShow })
