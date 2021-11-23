import { AddToPlaylistModal, ForgotPasswordModal, LoginModal, LoginToAlertModal,
  SignUpModal, VerifyEmailModal } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <AddToPlaylistModal />
      <ForgotPasswordModal />
      <LoginModal />
      <LoginToAlertModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
