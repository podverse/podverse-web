import OmniAural from "omniaural"

const modalsResetPasswordHide = () => {
  OmniAural.state.modals.resetPassword.show.set(false)
}

const modalsResetPasswordShow = () => {
  OmniAural.state.modals.resetPassword.show.set(true)
}

OmniAural.addActions(
  modalsResetPasswordHide,
  modalsResetPasswordShow
)
