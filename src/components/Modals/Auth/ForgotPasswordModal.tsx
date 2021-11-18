import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle, TextInput } from "~/components"
import { sendResetPassword } from "~/services/auth"

type Props = {}

export const ForgotPasswordModal = (props: Props) => {
  const [forgotPassword] = useOmniAural("modals.forgotPassword")
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [resetPasswordSent, setResetPasswordSent] = useState<boolean>(false)
  const [isSubmitPressed, setIsSubmitPressed] = useState<boolean>(false);

  /* Event Handlers */

  const _handleForgotPassword = async (email: string) => {
    try {
      setIsSubmitPressed(true);
      await sendResetPassword(email)
    } catch (error) {
      setIsSubmitPressed(false);
      //
    } finally {
      setIsSubmitPressed(false);
    }
    setResetPasswordSent(true)
  }

  const _onRequestClose = () => {
    setResetPasswordSent(false)
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='forgot-password-modal centered'
      contentLabel={t('Forgot password modal')}
      isOpen={forgotPassword.show}
      onRequestClose={_onRequestClose}>
      <ButtonClose onClick={_onRequestClose} />
      {
        resetPasswordSent && (
          <div className='message-wrapper'>
            <div className='message with-margin'>
              {t('Reset password email sent1')}
            </div>
            <div className='message bottom'>
              {t('Reset password email sent2')}
            </div>
          </div>
        )
      }
      {
        !resetPasswordSent && (
          <>
            <h2>{t('Forgot Password')}</h2>
            <TextInput
              label={t('Email')}
              onChange={setEmail}
              onSubmit={() => _handleForgotPassword(email)}
              placeholder={t('Email')}
              type='email'
              value={forgotPassword.email} />
            <div className='submit-buttons'>
              <ButtonRectangle
                label={t('Cancel')}
                onClick={_onRequestClose}
                type='secondary' />
              <ButtonRectangle
                isLoading={isSubmitPressed}
                label={t('Submit')}
                onClick={() => _handleForgotPassword(email)}
                type='primary' />
            </div>
          </>
        )
      }
    </Modal>
  )
}
