import * as React from 'react'
import * as Modal from 'react-modal'

export interface Props {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isOpen?: boolean
}

const customStyles = {
  content: {
    bottom: 'unset',
    left: '50%',
    maxWidth: '380px',
    overflow: 'unset',
    right: 'unset',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}

export const DeleteAccountModal: React.StatelessComponent<Props> = props => {
  const { handleHideModal, isOpen } = props

  // @ts-ignore
  const appEl = process.browser ? document.querySelector('body') : null

  return (
    <Modal
      appElement={appEl}
      contentLabel='Delete Account'
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='delete-account-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      <div>
        <h4>Delete Account</h4>
        <p>Are you sure you want to delete your account? This is irreversible (unless you download your data and restore it later).</p>
      </div>
    </Modal>
  )
}
