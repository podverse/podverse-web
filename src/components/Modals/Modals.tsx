import { ForgotPasswordModal, LoginModal, LoginToAlertModal,
  SignUpModal, VerifyEmailModal } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <ForgotPasswordModal />
      <LoginModal />
      <LoginToAlertModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
