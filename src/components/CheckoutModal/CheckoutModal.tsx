import * as React from 'react'
import * as Modal from 'react-modal'
import { CloseButton } from 'podverse-ui'
import PayPalButton from '~/components/PayPalButton/PayPalButton'
import { paypalConfig } from '~/config'

type Props = {
  handleHideModal: Function
  isOpen?: boolean
}

type State = {}

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

const PAYPAL_CLIENT = {
  production: paypalConfig.production,
  sandbox: paypalConfig.sandbox
}
const PAYPAL_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'


class CheckoutModal extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {}
  }

  onCancel (data) {
    console.log('Cancelled payment!', data)
  }

  onError (error) {
    console.log('Erroneous payment OR failed to load script!', error)
  }

  onSuccess (payment) {
    console.log('Successful payment!', payment)
  }

  render () {
    const { handleHideModal, isOpen } = this.props
  
    // @ts-ignore
    const appEl = process.browser ? document.querySelector('body') : null
    
    return (
      <Modal
        appElement={appEl}
        contentLabel='Checkout'
        isOpen={isOpen}
        onRequestClose={handleHideModal}
        portalClassName='checkout-modal over-media-player'
        shouldCloseOnOverlayClick
        style={customStyles}>
        <div style={{textAlign: 'center'}}>
          <h4>Checkout</h4>
          <CloseButton onClick={handleHideModal} />
          <div id="paypal-button"></div>
          <PayPalButton
            client={PAYPAL_CLIENT}
            commit={true}
            currency={'USD'}
            env={PAYPAL_ENV}
            onCancel={this.onCancel}
            onError={this.onError}
            onSuccess={this.onSuccess}
            total={100} />
          <hr />
          <button>coingate</button>
        </div>
      </Modal>
    )
  }
}

export default CheckoutModal
