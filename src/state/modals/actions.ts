import './addToPlaylist/actions'
import './checkout/actions'
import './confirmDeleteAccount/actions'
import './forgotPassword/actions'
import './funding/actions'
import './login/actions'
import './loginToAlert/actions'
import './share/actions'
import './signUp/actions'
import './verifyEmail/actions'

import OmniAural from 'omniaural'

const modalsHideAll = () => {
  OmniAural.modalsAddToPlaylistHide()
  OmniAural.modalsCheckoutHide()
  OmniAural.modalsConfirmDeleteAccountHide()
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsFundingHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsLoginToAlertHide()
  OmniAural.modalsShareHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions({ modalsHideAll })
