import OmniAural, { useOmniAural } from "omniaural"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, TextInput } from "~/components"
import { PV } from "~/resources"

type Props = {}

export const LoginModal = (props: Props) => {
  const [modals] = useOmniAural("modals")
  const { t } = useTranslation()

  return (
    <Modal
      className='login-modal centered'
      contentLabel={t('Login modal')}
      isOpen={modals.login.show}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}>
      <h2>{t('Login')}</h2>
      <ButtonClose onClick={onRequestClose} />
      <TextInput
        label={t('Email')}
        placeholder={PV.TextInput.emailPlaceholder}
        value='test@podverse.fm' />
      <TextInput
        label={t('Password')}
        placeholder={t('Password')}
        value='' />
    </Modal>
  )
}

/* Event Handlers */
const onAfterOpen = () => {
  // console.log('onAfterOpen')
}

const onRequestClose = () => {
  OmniAural.modalsLoginHide()
}