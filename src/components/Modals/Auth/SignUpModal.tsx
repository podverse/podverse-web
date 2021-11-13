import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonLink, ButtonRectangle, TextInput } from "~/components"
import { login as loginService } from "~/services/auth"

type Props = {}

export const SignUpModal = (props: Props) => {
  const [login] = useOmniAural("modals.login")
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  /* Event Handlers */

  const _handleForgotPassword = async () => {
    try {
      await loginService(email, password)
    } catch (error) {
      const pleaseVerifyMessage = (
        <>
          <p>{t('PleaseVerifyEmail')}</p>
          {/* <span><a href='#' onClick={this._showSendVerificationEmailModal}>{t('SendVerificationEmail')}</a></span> */}
        </>
      )
      const errorMsg =
        (error.response && error.response.status === 460 && pleaseVerifyMessage) ||
        (error.response && error.response.data && error.response.data.message)
        || t('errorMessages:internetConnectivityErrorMessage')

      // TODO: handle error message
      console.log('errorMsg', error)
    }
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='sign-up-modal centered'
      contentLabel={t('Sign up modal')}
      isOpen={login.show}
      onRequestClose={_onRequestClose}>
      <h2>{t('Forgot Password')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <TextInput
        label={t('Email')}
        onChange={setEmail}
        placeholder={t('Email')}
        type='email'
        value={login.email} />
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Cancel')}
          onClick={_onRequestClose}
          type='secondary' />
        <ButtonRectangle
          label={t('Submit')}
          onClick={_handleForgotPassword}
          type='primary' />
      </div>
    </Modal>
  )
}
