import OmniAural from "omniaural"

const modalsForgotPasswordHide = () => {
  OmniAural.state.modals.forgotPassword.show.set(false)
}

const modalsForgotPasswordShow = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.forgotPassword.show.set(true)
}

OmniAural.addActions({ modalsForgotPasswordHide, modalsForgotPasswordShow })
