import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageIsLoading } from '~/redux/actions'
import { getCoingateOrderById } from '~/services/'

type Props = {
  id: string
}

type State = {
  coingateOrder?: any
  currentCount: number
  hasError?: boolean
  intervalId?: any
  isChecking?: boolean
  wasSuccessful?: boolean
}

class PaymentConfirmingCoingate extends Component<Props, State> {

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

    const coingateOrder = await getCoingateOrderById(id)

    const intervalId = setInterval(this.checkPaymentStatus, 15000)
    this.setState({
      coingateOrder,
      intervalId,
      isChecking: !!coingateOrder
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
      const coingateOrder = await getCoingateOrderById(id)

      if (coingateOrder && coingateOrder.data && coingateOrder.data.state === 'completed') {
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
    const { hasError, isChecking, wasSuccessful } = this.state

    return (
      <div className='page-loading-overlay show max-width allow-pointer-events'>
        {
          isChecking &&
          <Fragment>
            <p>Confirming payment with the network...</p>
            <FontAwesomeIcon icon='spinner' spin />
            <p>This may take a while. You may leave this page and check your <a href='/settings#membership'>Settings page</a> later
              to confirm your transaction has completed.</p>
            <p>Thank you for using decentralized, open source technology :D</p>
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
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmingCoingate)
