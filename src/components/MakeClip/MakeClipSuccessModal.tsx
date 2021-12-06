import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle, TextInputCopy } from '~/components'

type Props = {}

export const MakeClipSuccessModal = (props: Props) => {
  const [makeClip] = useOmniAural('makeClip')
  const { t } = useTranslation()
  const { successModalLinkUrl, successModalShow } = makeClip

  /* Function Helpers */

  const _onRequestClose = () => {
    OmniAural.makeClipSuccessModalHide()
  }

  /* Render Helpers */

  return (
    <Modal
      className='make-clip-success-modal centered'
      isOpen={successModalShow}
      onRequestClose={_onRequestClose}
      overlayClassName='make-clip-success-modal-overlay'
    >
      <ButtonClose onClick={_onRequestClose} />
      <h2>{t('Share Clip')}</h2>
      <TextInputCopy label={t('Link to clip')} value={successModalLinkUrl} />
    </Modal>
  )
}
