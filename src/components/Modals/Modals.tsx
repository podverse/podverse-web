import { ForgotPasswordModal, LoginModal, SignUpModal, VerifyEmailModal
  } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <ForgotPasswordModal />
      <LoginModal />
      <SignUpModal />
      <VerifyEmailModal />
    </>
  )
}
