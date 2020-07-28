import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Meta from '~/components/Meta/Meta'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import { getBitPayInvoiceStatusByOrderId } from '~/services/'
import config from '~/config'
const { BASE_URL } = config()

type Props = {
  id: string
  meta?: any
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

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.payment_bitpay_confirming,
      description: PV.pages.payment_bitpay_confirming._Description,
      title: PV.pages.payment_bitpay_confirming._Title
    }

    return { id: query.id, meta }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentCount: 0
    }
  }

  async componentDidMount() {
    const { id } = this.props
    this.setState({ isChecking: true })

    const bitpayInvoice = await getBitPayInvoiceStatusByOrderId(id)

    const intervalId = setInterval(this.checkPaymentStatus, 10000)
    this.setState({
      bitpayInvoice,
      intervalId,
      isChecking: !!bitpayInvoice
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  checkPaymentStatus = async () => {
    const { id } = this.props
    const { currentCount } = this.state
    const newState: any = {}

    try {
      const bitpayInvoice = await getBitPayInvoiceStatusByOrderId(id)

      if (bitpayInvoice && bitpayInvoice.data && (bitpayInvoice.data === PV.core.confirmed || bitpayInvoice.data === PV.core.complete)) {
        newState.hasError = false
        newState.isChecking = false
        newState.wasSuccessful = true
        this.setState(newState)
        location.href = PV.paths.web.settings_membership
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
    const { id, meta } = this.props
    const { hasError, isChecking, wasSuccessful } = this.state

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        {
          !id &&
            <p>Page not found</p>
        }
        {
          !!id &&
            <div className='waiting-for-payment'>
              {
                isChecking &&
                  <Fragment>
                    <p>Confirming payment with the network...</p>
                    <FontAwesomeIcon icon='spinner' spin />
                    <p>This may take 5-20 minutes. You can leave this page and check your <a href={PV.paths.web.settings_membership}>Settings page</a> later
                      to confirm when your transaction has completed.</p>
                  </Fragment>
              }
              {
                hasError &&
                  <Fragment>
                    <p>An error may have occurred, or the transaction is just taking a long time to confirm with the network.</p>
                    <p>Please visit your Settings page at a later time to check if your transaction completed, or email support@podverse.fm if you have an issue.</p>
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
