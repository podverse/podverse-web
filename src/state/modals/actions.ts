import './addToPlaylist/actions'
import './checkout/actions'
import './confirmDeleteAccount/actions'
import './forgotPassword/actions'
import './login/actions'
import './loginToAlert/actions'
import './signUp/actions'
import './verifyEmail/actions'

import OmniAural from 'omniaural'

const modalsHideAll = () => {
  OmniAural.modalsAddToPlaylistHide()
  OmniAural.modalsCheckoutHide()
  OmniAural.modalsConfirmDeleteAccountHide()
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsLoginToAlertHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions({ modalsHideAll })
