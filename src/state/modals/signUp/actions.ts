import OmniAural from 'omniaural'

const modalsSignUpHide = () => {
  OmniAural.state.modals.signUp.show.set(false)
}

const modalsSignUpShow = () => {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.signUp.show.set(true)
}

OmniAural.addActions({ modalsSignUpHide, modalsSignUpShow })
