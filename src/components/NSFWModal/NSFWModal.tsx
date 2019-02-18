import * as React from 'react'
import * as Modal from 'react-modal'
import colors from '~/lib/constants/colors'

export interface Props {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isNSFWModeOn?: boolean
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
          <h3 style={{ color: colors.redDarker }}>NSFW is ON</h3>
            <p>Refresh your browser to include NSFW podcasts</p>
          </div>
      }
      {
        !isNSFWModeOn &&
        <div>
          <h3 style={{ color: colors.blue }}>NSFW is OFF</h3>
          <p>Refresh your browser to hide NSFW podcasts</p>
          <p>Ratings are provided by the podcasters themselves. Content may not be "safe for work."</p>
        </div>
      }
    </Modal>
  )
}
