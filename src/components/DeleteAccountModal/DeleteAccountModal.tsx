import * as React from 'react'
import * as Modal from 'react-modal'
import { Button, ButtonGroup, CloseButton } from 'podverse-ui'
import { Input, Label } from 'reactstrap'
import PV from '~/lib/constants'
import { checkIfLoadingOnFrontEnd, safeAlert } from '~/lib/utility'
import { deleteLoggedInUser } from '~/services'
import { withTranslation } from '~/../i18n'

type Props = {
  email?: string
  handleHideModal: Function
  id: string
  isOpen?: boolean
  t?: any
}

type State = {
  confirmEmail?: string
  isConfirmed?: boolean
  isDeleting?: boolean
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

class DeleteAccountModal extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {
      confirmEmail: ''
    }
  }

  handleConfirmEmailInputChange = event => {
    const { email } = this.props
    const { value: confirmEmail } = event.target

    this.setState({
      confirmEmail: confirmEmail.trim(),
      isConfirmed: confirmEmail && email === confirmEmail
    })
  }

  handleHideModal = () => {
    const { handleHideModal } = this.props
    this.setState({ confirmEmail: '' })
    handleHideModal()
  }

  handleDeleteAccount = async () => {
    this.setState({ isDeleting: true })
    const { id, t } = this.props

    try {
      await deleteLoggedInUser(id)
      window.location.href = '/'
    } catch (error) {
      console.log(error)
      safeAlert(t('errorMessages:alerts.somethingWentWrong'))
    }
  }

  render() {
    const { email, handleHideModal, isOpen, t } = this.props
    const { confirmEmail, isConfirmed, isDeleting } = this.state
    const appEl = checkIfLoadingOnFrontEnd() ? document.querySelector('body') : null

    return (
      <Modal
        appElement={appEl}
        contentLabel={t('DeleteAccount')}
        isOpen={isOpen}
        onRequestClose={handleHideModal}
        portalClassName='delete-account-modal over-media-player'
        shouldCloseOnOverlayClick
        style={customStyles}>
        <div>
          <h3>{t('Delete Account')}</h3>
          <CloseButton onClick={handleHideModal} />
          <p>{t('This will delete all of your Podverse data')}</p>
          <p>{t('Any links you created will no longer work')}</p>
          <Label for='delete-account-modal__confirm-email'>{t('Type your email to proceed')}</Label>
          <Input
            name='delete-account-modal__confirm-email'
            onChange={this.handleConfirmEmailInputChange}
            placeholder={email}
            type='text'
            value={confirmEmail} />
          <ButtonGroup
            childrenRight={(
              <React.Fragment>
                <Button
                  className='delete-account-modal__cancel'
                  onClick={this.handleHideModal}
                  text={t('Cancel')} />
                <Button
                  className='delete-account-modal__submit'
                  color='danger'
                  disabled={!isConfirmed}
                  isLoading={isDeleting}
                  onClick={this.handleDeleteAccount}
                  text={t('Delete')} />
              </React.Fragment>
            )} />
        </div>
      </Modal>
    )
  }
}

export default withTranslation(PV.nexti18next.namespaces)(DeleteAccountModal)