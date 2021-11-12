import OmniAural from "omniaural"

const modalsSignUpHide = () => {
  OmniAural.state.modals.signUp.show.set(false)
}

const modalsSignUpShow = () => {
  OmniAural.state.modals.signUp.show.set(true)
}

OmniAural.addActions(
  modalsSignUpHide,
  modalsSignUpShow
)
