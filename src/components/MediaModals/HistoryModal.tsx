import * as React from 'react'
import * as Modal from 'react-modal'
import { CloseButton, MediaListItem } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { checkIfLoadingOnFrontEnd } from '~/lib/utility'

export interface Props {
  handleHideModal: (event: React.MouseEvent<HTMLButtonElement>) => void
  historyItems: any[]
  isLoggedIn: boolean
  isOpen: boolean
  t: any
}

type State = {}

const customStyles = {
  content: {
    bottom: 'unset',
    height: '90%',
    left: '50%',
    maxWidth: '520px',
    padding: '20px 20px 0 20px',
    right: 'unset',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}

export class HistoryModal extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  hideModal = event => {
    const { handleHideModal } = this.props

    if (handleHideModal) {
      handleHideModal(event)
      this.setState({
        isEditing: false
      })
    }
  }

  render() {
    const { historyItems = [], isLoggedIn, isOpen, t } = this.props

    const header = (
      <div className='queue-modal__header'>
        <h3><FontAwesomeIcon icon='history' /> &nbsp;{t('History')}</h3>
        <div className='queue-modal-header__close'>
          <CloseButton onClick={this.hideModal} />
        </div>
      </div>
    )

    let historyItemNodes: any = []

    const queueModalHistoryItemKey = 'queueModalHistoryItemKey'
    historyItemNodes = Array.isArray(historyItems) ? historyItems.map((x, index) => (
      <MediaListItem
        dataNowPlayingItem={x}
        hasLink
        hideDescription={true}
        key={`${queueModalHistoryItemKey}${index}`}
        itemType='now-playing-item'
        t={t} />
    )) : []

    let appEl
    if (checkIfLoadingOnFrontEnd()) {
      appEl = document.querySelector('body')
    }

    return (
      <Modal
        appElement={appEl}
        contentLabel={t('History')}
        isOpen={isOpen}
        onRequestClose={this.hideModal}
        portalClassName='queue-modal over-media-player'
        shouldCloseOnOverlayClick
        style={customStyles}>
        {header}
        <div className='scrollable-area'>
          {
            isLoggedIn
              ? historyItemNodes
              : <div className='no-results-msg'>{t('LoginToViewYourHistory')}</div>
          }
        </div>
      </Modal>
    )
  }
}
