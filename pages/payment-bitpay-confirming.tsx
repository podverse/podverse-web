import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageIsLoading } from '~/redux/actions'
import { getBitPayInvoiceStatusByOrderId } from '~/services/'

type Props = {
  id: string
}

type State = {
  bitpayInvoice?: any
  currentCount: number
  hasError?: boolean
  intervalId?: any
  isChecking?: boolean
  wasSuccessful?: boolean
}

class PaymentConfirmingBitPay extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    return { id: query.id }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentCount: 0
    }

    this.checkPaymentStatus = this.checkPaymentStatus.bind(this)
  }

  async componentDidMount() {
    const { id } = this.props
    this.setState({ isChecking: true })

    const bitpayInvoice = await getBitPayInvoiceStatusByOrderId(id)

    const intervalId = setInterval(this.checkPaymentStatus, 5000)
    this.setState({
      bitpayInvoice,
      intervalId,
      isChecking: !!bitpayInvoice
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  async checkPaymentStatus() {
    const { id } = this.props
    const { currentCount } = this.state
    let newState: any = {}

    try {
      const bitpayInvoice = await getBitPayInvoiceStatusByOrderId(id)

      if (bitpayInvoice && bitpayInvoice.data && bitpayInvoice.data === 'confirmed') {
        newState.hasError = false
        newState.isChecking = false
        newState.wasSuccessful = true
        this.setState(newState)
        location.href = '/settings#membership'
      } else {
        if (currentCount > 50) {
          clearInterval(this.state.intervalId)
          newState.hasError = true
          newState.isChecking = false
        } else {
          newState.currentCount = currentCount + 1
        }
      }
      this.setState(newState)
    } catch (error) {
      console.log(error)
      clearInterval(this.state.intervalId)
      newState.hasError = true
    }
  }

  render() {
    const { id } = this.props
    const { hasError, isChecking, wasSuccessful } = this.state

    return (
      <Fragment>
        {
          !id &&
            <p>Page not found</p>
        }
        {
          !!id &&
            <div className='page-loading-overlay show max-width allow-pointer-events'>
              {
                isChecking &&
                <Fragment>
                  <p>Confirming payment with the network...</p>
                  <FontAwesomeIcon icon='spinner' spin />
                  <p>This may take a while. You can leave this page and check your <a href='/settings#membership'>Settings page</a> later
                    to confirm when your transaction has completed.</p>
                </Fragment>
              }
              {
                hasError &&
                <Fragment>
                  <p>An error may have occurred, or the transaction is just taking a long time to confirm with the network.</p>
                  <p>Please visit your Settings page at a later time to check if your transaction completed, or email support@podverse.fm if you think there is an issue.</p>
                </Fragment>
              }
              {
                wasSuccessful &&
                <Fragment>
                  <p>Payment confirmed!</p>
                  <p>Redirecting to your settings page...</p>
                </Fragment>
              }
            </div>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmingBitPay)
