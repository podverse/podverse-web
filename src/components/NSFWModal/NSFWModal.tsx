import * as React from 'react'
import * as Modal from 'react-modal'
import PV from '~/lib/constants'
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
      contentLabel={PV.components.NSFWModal}
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='nsfw-confirm-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      {
        isNSFWModeOn &&
          <div>
          <h3 style={{ color: PV.colors.redDarker }}>{PV.components.NSFWModal.NSFWModeOn}</h3>
            <p>{PV.components.NSFWModal.RefreshToIncludeNSFW}</p>
          </div>
      }
      {
        !isNSFWModeOn &&
        <div>
          <h3 style={{ color: PV.colors.blue }}>{PV.components.NSFWModal.SFWModeOn}</h3>
          <p>{PV.components.NSFWModal.RefreshToHideNSFW}</p>
          <p>
            {PV.components.NSFWModal.RatingsProvidedByPodcasters}
            {PV.components.NSFWModal.ContentMayBeNSFW}
          </p>
        </div>
      }
    </Modal>
  )
}
