import { ForgotPasswordModal, LoginModal } from "~/components"

type Props = {}

export const Modals = (props: Props) => {
  return (
    <>
      <ForgotPasswordModal />
      <LoginModal />
    </>
  )
}
