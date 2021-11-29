import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, MakeClipForm } from '~/components'

type Props = {}

export const MakeClipModal = (props: Props) => {
  const { t } = useTranslation()
  const [makeClip] = useOmniAural('makeClip')

  const _onRequestClose = OmniAural.makeClipHide

  return (
    <Modal
      className='make-clip-modal centered'
      isOpen={makeClip.show}
      overlayClassName='make-clip-modal-overlay'
      onRequestClose={_onRequestClose}>
      <ButtonClose onClick={_onRequestClose} />
      <MakeClipForm handleCancel={_onRequestClose} />
    </Modal>
  )
}