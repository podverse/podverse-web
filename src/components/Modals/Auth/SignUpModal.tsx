import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, PasswordInputs } from "~/components"
import { signUp as signUpService } from "~/services/auth"

type Props = {}

export const SignUpModal = (props: Props) => {
  const [signUp] = useOmniAural("modals.signUp")
  const { t } = useTranslation()
  const [isSignUpPressed, setIsSignUpPressed] = useState<boolean>(false);

  /* Event Handlers */

  const _handleSignUp = async (email: string, password: string) => {
    try {
      setIsSignUpPressed(true);
      await signUpService(email, password)
      OmniAural.modalsVerifyEmailShow()
    } catch (error) {
      setIsSignUpPressed(false);
      if (error.response?.status === 460) {
        OmniAural.modalsVerifyEmailShow()
      } else if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert(t('errorMessages:internetConnectivityErrorMessage'))
      }
    } finally {
      setIsSignUpPressed(false);
    }
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='sign-up-modal centered'
      contentLabel={t('Sign up modal')}
      isOpen={signUp.show}
      onRequestClose={_onRequestClose}>
      <h2>{t('Sign Up')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <div className='header-wrapper'>
        <div>{t('Try premium free for 1 year!')}</div>
        <div>{t('$10 per year after that')}</div>
      </div>
      <PasswordInputs
        handleClose={_onRequestClose}
        handleSubmit={_handleSignUp}
        isSignUpPressed={isSignUpPressed} />
    </Modal>
  )
}
