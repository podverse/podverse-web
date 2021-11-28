import { AddToPlaylistModal, CheckoutModal, ForgotPasswordModal, LoginModal,
  LoginToAlertModal, MakeClipModal, SignUpModal, VerifyEmailModal } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <AddToPlaylistModal />
      <CheckoutModal />
      <ForgotPasswordModal />
      <LoginModal />
      <LoginToAlertModal />
      <MakeClipModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
