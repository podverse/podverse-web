import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import { pageIsLoading } from '~/redux/actions'
import { getPayPalOrderById } from '~/services/'
const { BASE_URL } = config()

type Props = {
  id: string
  meta?: any
}

type State = {
  currentCount: number
  hasError?: boolean
  intervalId?: any
  isChecking?: boolean
  isTakingLonger?: boolean
  paypalOrder?: any
  wasSuccessful?: boolean
}

class PaymentConfirmingPayPal extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: BASE_URL + '/payment-paypal-confirming',
      description: 'PayPal payment confirmation screen on Podverse',
      title: 'Confirming PayPal payment...'
    }

    return { id: query.id, meta }
  }

  constructor (props) {
    super(props)
    
    this.state = {
      currentCount: 0
    }
  }

  async componentDidMount () {
    const { id } = this.props
    this.setState({ isChecking: true })
    
    const paypalOrder = await getPayPalOrderById(id)

    const intervalId = setInterval(this.checkPaymentStatus, 5000)
    this.setState({ 
      intervalId,
      isChecking: !!paypalOrder,
      paypalOrder
    })
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
  }

  checkPaymentStatus = async () => {
    const { id } = this.props
    const { currentCount } = this.state
    const newState: any = {}

    try {
      const paypalOrder = await getPayPalOrderById(id)
  
      if (paypalOrder && paypalOrder.data && paypalOrder.data.state === 'approved') {
        newState.hasError = false
        newState.isChecking = false
        newState.isTakingLonger = false
        newState.wasSuccessful = true
        this.setState(newState)
        location.href = '/settings#membership'
      } else {
        if (currentCount > 10) {
          clearInterval(this.state.intervalId)
          newState.errorMessage = 'Something went wrong. Please check your internet connection.'
          newState.isChecking = false
        } else if (currentCount > 5) {
          newState.currentCount = currentCount + 1
          newState.isTakingLonger = true
        } else {
          newState.currentCount = currentCount + 1
        }
      }
      this.setState(newState)
    } catch (error) {
      console.log(error)
      clearInterval(this.state.intervalId)
      newState.errorMessage = 'Something went wrong. Please check your internet connection.'
    }
  }

  render() {
    const { meta } = this.props
    const { hasError, isChecking, isTakingLonger, wasSuccessful } = this.state

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
        <div className='waiting-for-payment'>
          {
            isChecking &&
              <Fragment>
                <p>Confirming PayPal payment...</p>
                <FontAwesomeIcon icon='spinner' spin />
                {
                  isTakingLonger && 
                    <p>Taking longer than expected...</p>
                }
                {
                  !isTakingLonger &&
                    <p>This may take a minute...</p>
                }
              </Fragment>
          }
          {
            hasError &&
              <Fragment>
                <p>Something went wrong. Please check your internet connection, or go to <a href='/settings#membership'>Settings > Membership</a> to check if your purchase was successful.</p>
                <p>If the problem continues, please email <a href='mailto:support@podverse.fm'>support@podverse.fm</a> for help.</p>
              </Fragment>
          }
          {
            wasSuccessful &&
              <Fragment>
                <p>Payment confirmed!</p>
                <p>Redirecting to your Settings page...</p>
              </Fragment>
          }
        </div> 
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmingPayPal)
