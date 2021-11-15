import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonLink, ButtonRectangle, TextInput } from "~/components"
import { login as loginService } from "~/services/auth"

type Props = {}

export const LoginModal = (props: Props) => {
  const [login] = useOmniAural("modals.login")
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  /* Event Handlers */

  const _handleLogin = async () => {
    try {
      await loginService(email, password)
      window.location.reload()
    } catch (error) {
      if (error.response?.status === 460) {
        OmniAural.modalsVerifyEmailShow()
      } else if (error.response?.data?.message) {
        alert(error.response?.data?.message)
      } else {
        alert(t('errorMessages:internetConnectivityErrorMessage'))
      }
    }
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='login-modal centered'
      contentLabel={t('Login modal')}
      isOpen={login.show}
      onRequestClose={_onRequestClose}>
      <h2>{t('Login')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <TextInput
        label={t('Email')}
        onChange={(value) => {
          setEmail(value)
          OmniAural.modalsVerifyEmailEmail(value)
        }}
        placeholder={t('Email')}
        type='email'
        value={login.email} />
      <TextInput
        label={t('Password')}
        onChange={setPassword}
        placeholder={t('Password')}
        type='password'
        value={login.password} />
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Cancel')}
          onClick={_onRequestClose}
          type='secondary' />
        <ButtonRectangle
          label={t('Submit')}
          onClick={_handleLogin}
          type='primary' />
      </div>
      <div className='signup-buttons'>
        <ButtonLink
          label={t('Reset Password')}
          onClick={() => OmniAural.modalsForgotPasswordShow()} />
        <ButtonLink
          onClick={() => OmniAural.modalsSignUpShow()}
          label={t('Sign Up')} />
      </div>
    </Modal>
  )
}
