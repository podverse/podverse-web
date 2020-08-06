import * as React from 'react'
import * as Modal from 'react-modal'
import PV from '~/lib/constants'
import { checkIfLoadingOnFrontEnd } from '~/lib/utility'
import { withTranslation } from '../../../i18n'

export interface Props {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isNSFWModeOn?: boolean
  isOpen?: boolean
  t?: any
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

  const NSFWModal: React.StatelessComponent<Props> = props => {
  const { handleHideModal, isNSFWModeOn, isOpen, t } = props
  const appEl = checkIfLoadingOnFrontEnd() ? document.querySelector('body') : null

  return (
    <Modal
      appElement={appEl}
      contentLabel={t('NSFWConfirmPopup')}
      isOpen={isOpen}
      onRequestClose={handleHideModal}
      portalClassName='nsfw-confirm-modal over-media-player'
      shouldCloseOnOverlayClick
      style={customStyles}>
      {
        isNSFWModeOn &&
          <div>
          <h3 style={{ color: PV.colors.redDarker }}>{t('NSFWModeOn')}</h3>
            <p>{t('RefreshToIncludeNSFW')}</p>
          </div>
      }
      {
        !isNSFWModeOn &&
        <div>
          <h3 style={{ color: PV.colors.blue }}>{t('SFWModeOn')}</h3>
          <p>{t('RefreshToHideNSFW')}</p>
          <p>
            {t('RatingsProvidedByPodcasters')}
            {t('ContentMayBeNSFW')}
          </p>
        </div>
      }
    </Modal>
  )
}

export default withTranslation(PV.nexti18next.namespaces)(NSFWModal)