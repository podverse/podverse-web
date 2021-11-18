import OmniAural, { useOmniAural } from "omniaural"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle } from "~/components"

type Props = {}

export const LoginToAlertModal = (props: Props) => {
  const [loginToAlert] = useOmniAural("modals.loginToAlert")
  const { t } = useTranslation()
  const { alertType } = loginToAlert

  /* Event Handlers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  /* Render Helpers */

  const getMessageText = () => {
    switch (alertType) {
      case 'add item to playlist':
        return t('LoginToSubscribeToThisPodcast')
      case 'create clip':
        return t('LoginToCreateAndShareClips')
      case 'subscribe to playlist':
        return t('LoginToSubscribeToThisPlaylist')
      case 'subscribe to podcast':
        return t('LoginToSubscribeToThisPodcast')
      case 'subscribe to profile':
        return t('LoginToSubscribeToThisProfile')
      default:
        break;
    }
  }

  return (
    <Modal
      className='login-to-alert-modal centered'
      contentLabel={t('Login to continue')}
      isOpen={!!alertType}
      onRequestClose={_onRequestClose}>
      <ButtonClose onClick={_onRequestClose} />
      <div className='message-wrapper'>
        <div className='message with-margin'>
          {getMessageText()}
        </div>
      </div>
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Close')}
          onClick={_onRequestClose}
          type='secondary' />
        <ButtonRectangle
          label={t('Log in')}
          onClick={OmniAural.modalsLoginShow}
          type='primary' />
      </div>
    </Modal>
  )
}
