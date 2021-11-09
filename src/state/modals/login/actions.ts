import OmniAural from "omniaural"

const modalsLoginHide = () => {
  OmniAural.state.modals.login.show.set(false)
}

const modalsLoginShow = () => {
  OmniAural.state.modals.login.show.set(true)
}

OmniAural.addActions(
  modalsLoginHide,
  modalsLoginShow
)
