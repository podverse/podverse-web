import OmniAural from 'omniaural'

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

const modalsVerifyEmailShowWithSendVerificationButton = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.verifyEmail.show.set(true)
  OmniAural.state.modals.verifyEmail.showSendVerificationEmailButton.set(true)
}

OmniAural.addActions({
  modalsVerifyEmailEmail,
  modalsVerifyEmailHide,
  modalsVerifyEmailShow,
  modalsVerifyEmailShowWithSendVerificationButton
})
