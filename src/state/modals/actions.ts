import "./addToPlaylist/actions"
import "./forgotPassword/actions"
import "./login/actions"
import "./loginToAlert/actions"
import "./share/actions"
import "./signUp/actions"
import "./verifyEmail/actions"

import OmniAural from "omniaural"

const modalsHideAll = () => {
  OmniAural.modalsAddToPlaylistHide()
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsLoginToAlertHide()
  OmniAural.modalsShareHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions({ modalsHideAll })
