import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose, MakeClipForm } from '~/components'
import { OmniAuralState } from '~/state/omniauralState'

type Props = unknown

export const MakeClipModal = (props: Props) => {
  const [makeClip] = useOmniAural('makeClip') as [OmniAuralState['makeClip']]

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
