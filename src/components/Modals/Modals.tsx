import {
  AddToPlaylistModal,
  CheckoutModal,
  ConfirmDeleteAccountModal,
  ForgotPasswordModal,
  FundingModal,
  LoginModal,
  LoginToAlertModal,
  MakeClipModal,
  ShareModal,
  SignUpModal,
  VerifyEmailModal
} from '~/components'
import { MakeClipSuccessModal } from '../MakeClip/MakeClipSuccessModal'

type Props = unknown

export const Modals = (props: Props) => {
  return (
    <>
      <AddToPlaylistModal />
      <CheckoutModal />
      <ConfirmDeleteAccountModal />
      <ForgotPasswordModal />
      <FundingModal />
      <LoginModal />
      <LoginToAlertModal />
      <MakeClipModal />
      <MakeClipSuccessModal />
      <ShareModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
