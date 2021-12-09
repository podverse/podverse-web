import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose, MakeClipForm } from '~/components'

type Props = unknown

export const MakeClipModal = (props: Props) => {
  const [makeClip] = useOmniAural('makeClip')

  const _onRequestClose = OmniAural.makeClipHide

  return (
    <Modal
      className='make-clip-modal centered'
      isOpen={makeClip.show}
      overlayClassName='make-clip-modal-overlay'
      onRequestClose={_onRequestClose}
    >
      <ButtonClose onClick={_onRequestClose} />
      <MakeClipForm handleCancel={_onRequestClose} />
    </Modal>
  )
}
