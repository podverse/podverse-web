import * as React from 'react'
import * as Modal from 'react-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { PVButton as Button, CloseButton } from 'podverse_ui'
import PayPalButton from '~/components/PayPalButton/PayPalButton'
import { paypalConfig } from '~/config'
import { pageIsLoading } from '~/redux/actions'
import { createBitPayInvoice } from '~/services'

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
    padding: '20px 20px 30px 20px',
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

    this.createBitPayOrder = this.createBitPayOrder.bind(this)
  }

  async createBitPayOrder () {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    try {
      const response = await createBitPayInvoice()
      const obj = response.data
      location.href = obj.url // Redirect to BitPay invoice
    } catch (err) {
      console.log(err)
      pageIsLoading(false)
      alert('Something went wrong. Please check your internet connection.')
    }
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
          <p>$3 = 1 year of Podverse Premium</p>
          <p></p>
          <PayPalButton
            client={PAYPAL_CLIENT}
            commit={true}
            currency={'USD'}
            env={PAYPAL_ENV}
            handlePageIsLoading={pageIsLoading}
            hideCheckoutModal={handleHideModal}
            total={3} />
          <input 
            alt="Pay with BitPay"
            className='checkout-modal__bitpay'
            height="45px"
            onClick={this.createBitPayOrder}
            src="/static/images/bitpay-btn-pay.svg"
            type="image" />
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
