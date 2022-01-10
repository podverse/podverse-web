import {
  AddToPlaylistModal,
  CheckoutModal,
  ConfirmDeleteAccountModal,
  ForgotPasswordModal,
  LoginModal,
  LoginToAlertModal,
  MakeClipModal,
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
      <LoginModal />
      <LoginToAlertModal />
      <MakeClipModal />
      <MakeClipSuccessModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
