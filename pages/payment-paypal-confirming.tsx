import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageIsLoading } from '~/redux/actions'
import { getPayPalOrderById } from '~/services/'

type Props = {
  id: string
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
    return { id: query.id }
  }

  constructor (props) {
    super(props)
    
    this.state = {
      currentCount: 0
    }

    this.checkPaymentStatus = this.checkPaymentStatus.bind(this)
  }

  async componentDidMount () {
    const { id } = this.props
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

  async checkPaymentStatus () {
    const { id } = this.props
    const { currentCount } = this.state
    let newState: any = {}

    try {
      const paypalOrder = await getPayPalOrderById(id)
  
      if (paypalOrder && paypalOrder.data && paypalOrder.data.state === 'completed') {
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
    const { hasError, isChecking, isTakingLonger, wasSuccessful } = this.state

    return (
        <div className='page-loading-overlay show max-width allow-pointer-events'>
          {
            isChecking &&
              <Fragment>
                <p>Confirming PayPal payment...</p>
                <FontAwesomeIcon icon='spinner' spin />
                {
                  isTakingLonger && 
                    <p>taking longer than expected...</p>
                }
              </Fragment>
          }
          {
            hasError &&
              <Fragment>
                <p>Something went wrong. Please check your internet connection, or go to <a href='/settings#membership'>Settings > Membership</a> to check if your purchase was successful.</p>
                <p>If the problem continues, please contact <a href='mailto:support@podverse.fm'>support@podverse.fm</a> for help.</p>
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
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmingPayPal)
