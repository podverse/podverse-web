import OmniAural from "omniaural"

type AlertTypes = 'add item to playlist' | 'make clip' |
  'subscribe to playlist' | 'subscribe to podcast' | 'subscribe to profile'

const modalsLoginToAlertHide = () => {
  OmniAural.state.modals.loginToAlert.alertType.set(false)
}

function modalsLoginToAlertShow (alertType: AlertTypes) {
  OmniAural.modalsHideAll()
  OmniAural.state.modals.loginToAlert.alertType.set(alertType)
}

OmniAural.addActions({ modalsLoginToAlertHide, modalsLoginToAlertShow })
