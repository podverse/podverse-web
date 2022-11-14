import './addToPlaylist/actions'
import './checkout/actions'
import './confirmDeleteAccount/actions'
import './featureVideoPreview/actions'
import './forgotPassword/actions'
import './funding/actions'
import './login/actions'
import './loginToAlert/actions'
import './share/actions'
import './signUp/actions'
import './v4vBoostSentInfo/actions'
import './verifyEmail/actions'

import OmniAural from 'omniaural'

const modalsHideAll = () => {
  OmniAural.modalsAddToPlaylistHide()
  OmniAural.modalsCheckoutHide()
  OmniAural.modalsConfirmDeleteAccountHide()
  OmniAural.modalsFeatureVideoPreviewHide()
  OmniAural.modalsForgotPasswordHide()
  OmniAural.modalsFundingHide()
  OmniAural.modalsLoginHide()
  OmniAural.modalsLoginToAlertHide()
  OmniAural.modalsShareHide()
  OmniAural.modalsSignUpHide()
  OmniAural.modalsV4VBoostSentInfoHide()
  OmniAural.modalsVerifyEmailHide()
}

OmniAural.addActions({ modalsHideAll })
