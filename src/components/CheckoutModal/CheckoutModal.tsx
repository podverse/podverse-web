import * as React from 'react'
import * as Modal from 'react-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CloseButton } from 'podverse-ui'
import PayPalButton from '~/components/PayPalButton/PayPalButton'
import config from '~/config'
import { pageIsLoading } from '~/redux/actions'
import { createBitPayInvoice } from '~/services'
import PV from '~/lib/constants'
import { alertRateLimitError, checkIfLoadingOnFrontEnd, safeAlert } from '~/lib/utility';
const { paypalConfig } = config()

type Props = {
  handleHideModal: Function
  isOpen?: boolean
  pageIsLoading?: any
}

type State = {
  buttonIsLoading: boolean
}

const customStyles = {
  content: {
    bottom: 'unset',
    left: '50%',
    maxWidth: '380px',
    overflow: 'unset',
    padding: '20px',
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

  constructor(props) {
    super(props)

    this.state = {
      buttonIsLoading: true
    }
  }

  createBitPayOrder = async () => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    try {
      const response = await createBitPayInvoice()
      const obj = response.data
      location.href = obj.url // Redirect to BitPay invoice
    } catch (error) {
      pageIsLoading(false)
      this.setState({ buttonIsLoading: false })
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
        return
      } else {
        safeAlert(PV.errors.alerts.somethingWentWrong)
      }
    }
  }

  handleButtonIsLoading = () => {
    this.setState({ buttonIsLoading: true })
  }

  handleButtonIsNotLoading = () => {
    this.setState({ buttonIsLoading: false })
  }

  handleHideModal = () => {
    const { handleHideModal } = this.props
    this.handleButtonIsLoading()
    handleHideModal()
  }

  render() {
    const { isOpen, pageIsLoading } = this.props
    const appEl = checkIfLoadingOnFrontEnd() ? document.querySelector('body') : null
    
    return (
      <Modal
        appElement={appEl}
        contentLabel={PV.core.Checkout}
        isOpen={isOpen}
        onRequestClose={this.handleHideModal}
        portalClassName='checkout-modal over-media-player'
        shouldCloseOnOverlayClick
        style={customStyles}>
        <div style={{textAlign: 'center'}}>
          <h3>Checkout</h3>
          <CloseButton onClick={this.handleHideModal} />
          <PayPalButton
            client={PAYPAL_CLIENT}
            commit={true}
            currency={'USD'}
            env={PAYPAL_ENV}
            handlePageIsLoading={pageIsLoading}
            hideCheckoutModal={this.handleHideModal}
            updateStateAfterScriptLoads={this.handleButtonIsNotLoading}
            total={10} />
          {/* {
            !buttonIsLoading &&
              <input 
                alt="Pay with BitPay"
                className='checkout-modal__bitpay'
                height="45px"
                onClick={this.createBitPayOrder}
                src="/images/bitpay-btn-pay.svg"
                type="image" />
          } */}
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
