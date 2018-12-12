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
    maxWidth: '360px',
    overflow: 'unset',
    right: 'unset',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}

export const DownloadDataModal: React.StatelessComponent<Props> = props => {
  const { handleHideModal, isOpen } = props

  // @ts-ignore
  const appEl = process.browser ? document.querySelector('body') : null

  return (
    <Modal
      appElement={appEl}
      contentLabel='Delete Account'
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='download-data-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      <div>
        <h4>Download</h4>
        <p>Click the button below to download a backup of your Podverse data.</p>
      </div>
    </Modal>
  )
}
