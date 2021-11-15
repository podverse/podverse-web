import "./forgotPassword/actions"
import "./login/actions"
import "./signUp/actions"
import "./verifyEmail/actions"

import OmniAural from "omniaural"

const modalsHideAll = () => {
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions(
  modalsHideAll
)
