import "./forgotPassword/actions"
import "./login/actions"
import "./resetPassword/actions"
import "./signUp/actions"

import OmniAural from "omniaural"

const modalsHideAll = () => {
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsResetPasswordHide()
  OmniAural.modalsSignUpHide()
}

OmniAural.addActions(
  modalsHideAll
)
