import OmniAural, { useOmniAural } from "omniaural"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle } from "~/components"

type Props = {}

export const ShareModal = (props: Props) => {
  const [share] = useOmniAural("modals.share")
  const { t } = useTranslation()

  /* Event Handlers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='share-modal centered'
      contentLabel={t('Share')}
      isOpen={share}
      onRequestClose={_onRequestClose}>
      <ButtonClose onClick={_onRequestClose} />
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Close')}
          onClick={_onRequestClose}
          type='secondary' />
      </div>
    </Modal>
  )
}
