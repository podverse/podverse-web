import * as React from 'react'
import * as Modal from 'react-modal'
import { CloseButton } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import config from '~/config'
import { checkIfLoadingOnFrontEnd } from '~/lib/utility'
const { REQUEST_PODCAST_EMAIL } = config()

type Props = {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isOpen?: boolean
  t: any
}

type State = {}

const customStyles = {
  content: {
    bottom: 'unset',
    left: '50%',
    maxWidth: '420px',
    right: 'unset',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%'
  }
}

class RequestPodcastModal extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { handleHideModal, isOpen, t } = this.props

    let appEl
    if (checkIfLoadingOnFrontEnd()) {
      appEl = document.querySelector('body')
    }

    return (
      <Modal
        appElement={appEl}
        contentLabel={t('RequestAPodcast')}
        isOpen={isOpen}
        onRequestClose={handleHideModal}
        portalClassName='request-a-podcast-modal'
        shouldCloseOnOverlayClick
        style={customStyles}>
        <h3><FontAwesomeIcon icon='podcast' /> &nbsp;{t('RequestAPodcast')}</h3>
        <CloseButton onClick={handleHideModal} />
        <p>{t('RequestAPodcastLine1')}</p>
        <p>{t('RequestAPodcastLine2a')}<a href={`mailto:${REQUEST_PODCAST_EMAIL}`}>{REQUEST_PODCAST_EMAIL}</a>{t('RequestAPodcastLine2b')}</p>
        <p>{t('RequestAPodcastLine3')}</p>
      </Modal>
    )
  }
}

export { RequestPodcastModal }
