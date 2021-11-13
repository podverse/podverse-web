import { ForgotPasswordModal, LoginModal, SignUpModal } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <ForgotPasswordModal />
      <LoginModal />
      <SignUpModal />
    </>
  )
}
