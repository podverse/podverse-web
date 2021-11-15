import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle, TextInput } from "~/components"
import { sendVerification } from "~/services/auth"

type Props = {}

export const VerifyEmailModal = (props: Props) => {
  const [verifyEmail] = useOmniAural("modals.verifyEmail")
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [resetPasswordSent, setResetPasswordSent] = useState<boolean>(false)

  /* Event Handlers */

  const _handleSendVerificationEmail = async () => {
    try {
      const email = OmniAural.state.modals.verifyEmail.email.value()
      const response = await sendVerification(email)
      const successMessage = response?.data?.message
      alert(successMessage)
      return
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }
    }
    alert(t('errorMessages:internetConnectivityErrorMessage'))
  }

  const _onRequestClose = () => {
    setResetPasswordSent(false)
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='verify-email-modal centered'
      contentLabel={t('Verify email modal')}
      isOpen={verifyEmail.show}
      onRequestClose={_onRequestClose}>
      <ButtonClose onClick={_onRequestClose} />
      <div className='message-wrapper'>
        <div className='message with-margin'>
          {t('PleaseVerifyEmail')}
        </div>
        <ButtonRectangle
          label={t('Send Verification Email')}
          onClick={_handleSendVerificationEmail}
          type='primary' />
      </div>
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Close')}
          onClick={_onRequestClose}
          type='secondary' />
      </div>
    </Modal>
  )
}
