import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import { getPayPalOrderById } from '~/services/'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  id: string
  meta?: any
  t?: any
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

  static async getInitialProps({ query, req, store, t }) {
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.payment_paypal_confirming,
      description: t('pages:payment_paypal_confirming._Description'),
      title: t('pages:payment_paypal_confirming._Title')
    }
    const namespacesRequired = PV.nexti18next.namespaces

    return { id: query.id, meta, namespacesRequired }
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
    const { id, t } = this.props
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
        location.href = PV.paths.web.settings_membership
      } else {
        if (currentCount > 10) {
          clearInterval(this.state.intervalId)
          newState.errorMessage = t('errorMessages:alerts.somethingWentWrong')
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
      newState.errorMessage = t('errorMessages:alerts.somethingWentWrong')
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
                <p>Something went wrong. Please check your internet connection, or go to <a href={PV.paths.web.settings_membership}>Settings {">"} Membership</a> to check if your purchase was successful.</p>
                <p>If the problem continues, please email <a href={`mailto:${PV.misc.email.contact}`}>{PV.misc.email.contact}</a> for help.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(PaymentConfirmingPayPal))
