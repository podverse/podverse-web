import * as React from 'react'
import * as Modal from 'react-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { PVButton as Button, CloseButton } from 'podverse-ui'
import PayPalButton from '~/components/PayPalButton/PayPalButton'
import { paypalConfig } from '~/config'
import { pageIsLoading } from '~/redux/actions'

type Props = {
  handleHideModal: Function
  isOpen?: boolean
  pageIsLoading: any
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
const PAYPAL_ENV = paypalConfig.env


class CheckoutModal extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {}
  }

  createCoingateOrder () {
    console.log('coingate')
  }

  render () {
    const { handleHideModal, isOpen, pageIsLoading } = this.props
  
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
          <PayPalButton
            client={PAYPAL_CLIENT}
            commit={true}
            currency={'USD'}
            env={PAYPAL_ENV}
            handlePageIsLoading={pageIsLoading}
            hideCheckoutModal={handleHideModal}
            total={3} />
          <hr />
          <Button
            className='checkout-modal__coinbase'
            color='secondary'
            onClick={this.createCoingateOrder}>
            Pay with Crypto
          </Button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutModal)
