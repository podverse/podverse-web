import * as React from 'react'
import * as Modal from 'react-modal'
import colors from '~/lib/constants/colors'
import { constants } from '~/lib/constants/misc'
import { checkIfLoadingOnFrontEnd } from '~/lib/utility'

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
  const appEl = checkIfLoadingOnFrontEnd() ? document.querySelector('body') : null

  return (
    <Modal
      appElement={appEl}
      contentLabel={constants.src.components.NSFWModal}
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='nsfw-confirm-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      {
        isNSFWModeOn &&
          <div>
          <h3 style={{ color: colors.redDarker }}>{constants.src.components.NSFWModal.NSFWModeOn}</h3>
            <p>{constants.src.components.NSFWModal.RefreshToIncludeNSFW}</p>
          </div>
      }
      {
        !isNSFWModeOn &&
        <div>
          <h3 style={{ color: colors.blue }}>{constants.src.components.NSFWModal.SFWModeOn}</h3>
          <p>{constants.src.components.NSFWModal.RefreshToHideNSFW}</p>
          <p>
            {constants.src.components.NSFWModal.RatingsProvidedByPodcasters}
            {constants.src.components.NSFWModal.ContentMayBeNSFW}
          </p>
        </div>
      }
    </Modal>
  )
}
