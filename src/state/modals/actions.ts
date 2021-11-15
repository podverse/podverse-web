import "./forgotPassword/actions"
import "./login/actions"
import "./resetPassword/actions"
import "./signUp/actions"
import "./verifyEmail/actions"

import OmniAural from "omniaural"

const modalsHideAll = () => {
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsResetPasswordHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions(
  modalsHideAll
)
