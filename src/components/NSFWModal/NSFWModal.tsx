import * as React from 'react'
import * as Modal from 'react-modal'

export interface Props {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isNSFWModeOn?: boolean
  isOpen?: boolean
}

const customStyles = {
  content: {
    bottom: 'unset',
    left: '50%',
    maxWidth: '420px',
    overflow: 'unset',
    right: 'unset',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}

export const NSFWModal: React.StatelessComponent<Props> = props => {
  const { handleHideModal, isNSFWModeOn, isOpen } = props

  // @ts-ignore
  const appEl = process.browser ? document.querySelector('body') : null

  return (
    <Modal
      appElement={appEl}
      contentLabel='NSFW Confirm Popup'
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='nsfw-confirm-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      {
        isNSFWModeOn &&
          <div>
            <h4>NSFW mode is ON</h4>
            <p>Please refresh your browser to include NSFW podcasts in results.</p>
          </div>
      }
      {
        !isNSFWModeOn &&
        <div>
          <h4>NSFW mode is OFF</h4>
          <p>Please refresh your browser to exclude NSFW podcasts in results.</p>
          <p style={{fontSize: '0.875rem'}}>Ratings are provided by the podcasters themselves. Content may not actually be "safe for work."</p>
        </div>
      }
    </Modal>
  )
}
