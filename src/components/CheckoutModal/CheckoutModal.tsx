import * as React from 'react'
import * as Modal from 'react-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CloseButton } from 'podverse-ui'
import PayPalButton from '~/components/PayPalButton/PayPalButton'
import { pageIsLoading } from '~/redux/actions'
import { createBitPayInvoice } from '~/services'
import config from '~/config'
import { alertRateLimitError } from '~/lib/utility';
const { paypalConfig } = config()

type Props = {
  handleHideModal: Function
  isOpen?: boolean
  pageIsLoading?: any
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

  createBitPayOrder = async () => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    try {
      const response = await createBitPayInvoice()
      const obj = response.data
      location.href = obj.url // Redirect to BitPay invoice
    } catch (error) {
      pageIsLoading(false)
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
        return
      } else {
        alert('Something went wrong. Please check your internet connection.')
      }
    }
  }

  render() {
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
          <h3>Checkout</h3>
          <CloseButton onClick={handleHideModal} />
          <PayPalButton
            client={PAYPAL_CLIENT}
            commit={true}
            currency={'USD'}
            env={PAYPAL_ENV}
            handlePageIsLoading={pageIsLoading}
            hideCheckoutModal={handleHideModal}
            total={5} />
          {/* <input 
            alt="Pay with BitPay"
            className='checkout-modal__bitpay'
            height="45px"
            onClick={this.createBitPayOrder}
            src="/static/images/bitpay-btn-pay.svg"
            type="image" /> */}
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
