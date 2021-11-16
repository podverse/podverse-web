import OmniAural from "omniaural"

const modalsVerifyEmailEmail = (value: string) => {
  OmniAural.state.modals.verifyEmail.email.set(value || '')
}

const modalsVerifyEmailHide = () => {
  OmniAural.state.modals.verifyEmail.show.set(false)
}

const modalsVerifyEmailShow = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.verifyEmail.show.set(true)
}

// OmniAural.addActions(
//   modalsVerifyEmailEmail,
//   modalsVerifyEmailHide,
//   modalsVerifyEmailShow
// )

OmniAural.addAction(
  "modalsVerifyEmailEmail", modalsVerifyEmailEmail)

OmniAural.addAction(
  "modalsVerifyEmailHide", modalsVerifyEmailHide
)
OmniAural.addAction(
  "modalsVerifyEmailShow", modalsVerifyEmailShow)


