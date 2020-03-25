/* eslint-disable @typescript-eslint/camelcase */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createPayPalOrder } from '~/services/paypal'
import config from '~/config'
import { alertRateLimitError, safeAlert } from '~/lib/utility';
const { DOMAIN, PROTOCOL } = config()

type Props = {
  client?: string
  commit?: string
  currency?: string
  env?: string
  handlePageIsLoading: any
  hideCheckoutModal?: Function
  isScriptLoaded?: boolean
  isScriptLoadSucceed?: boolean
  onCancel: Function
  onError: Function
  onSuccess: Function
  subtotal?: string
  tax?: number
  total?: number
  updateStateAfterScriptLoads?: Function
}

type State = {
  addButtonToDOM?: any
  showButton?: any
}

class PaypalButton extends React.Component<Props, State> {
  constructor (props) {
    super(props);

    this.state = {
      addButtonToDOM: false,
      showButton: false
    }

    // React and ReactDOM are needed by the paypal.Button.react component

    // eslint-disable-next-line
    // @ts-ignore
    window.React = React
    // eslint-disable-next-line
    // @ts-ignore
    window.ReactDOM = ReactDOM
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed, updateStateAfterScriptLoads } = this.props

    // NOTE: There is a delay between when isScriptLoad is finished and when
    // the click event actually becomes active on the button. The setTimeout
    // adds the button hidden to the DOM, but waits before letting the user click it.
    // Hopefully there's a better way to do this...
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ addButtonToDOM: true })
      setTimeout(() => {
        this.setState({ showButton: true })
        if (updateStateAfterScriptLoads) {
          updateStateAfterScriptLoads()
        }
      }, 3000)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed, updateStateAfterScriptLoads } = nextProps

    const isLoadedButWasntLoadedBefore = !this.state.showButton &&
      !this.props.isScriptLoaded && isScriptLoaded

    if (isLoadedButWasntLoadedBefore && isScriptLoadSucceed) {
      this.setState({ addButtonToDOM: true })
      setTimeout(() => {
        this.setState({ showButton: true })
        if (updateStateAfterScriptLoads) {
          updateStateAfterScriptLoads()
        }
      }, 3000)
    }
  }

  render () {
    const { client, commit, currency, env, handlePageIsLoading, hideCheckoutModal,
      subtotal, tax, total } = this.props
    const { addButtonToDOM, showButton } = this.state

    const payment = async (resolve, reject) => {
      try {
        // eslint-disable-next-line
        // @ts-ignore
        const paymentID = await paypal.rest.payment.create(env, client, {
          intent: 'sale',
          payer: {
            payment_method: 'paypal'
          },
          transactions: [
            {
              amount: {
                total,
                currency,
                details: {
                  subtotal,
                  tax
                }
              }
            }
          ],
          application_context: {
            brand_name: 'Podverse',
            locale: 'US',
            landing_page: 'Login',
            shipping_preference: 'NO_SHIPPING'
          },
          redirect_urls: {
            cancel_url: `${PROTOCOL}://${DOMAIN}/settings#membership`,
            return_url: `${PROTOCOL}://${DOMAIN}/settings#membership`
          }
        })

        try {
          createPayPalOrder({ paymentID })
          resolve(paymentID)
        } catch (error) {
          console.log(error)
          safeAlert('Something went wrong. Please check your internet connection.')
          reject()
        }
      } catch (error) {
        if (error && error.response && error.response.status === 429) {
          alertRateLimitError(error)
          return
        } else {
          safeAlert('Something went wrong. Please check your internet connection.')
        }
        console.log(error)
        reject()
      }
    }
    
    
    const onAuthorize = (data, actions) => {
      handlePageIsLoading(true)

      return actions.payment.execute()
        .then(() => {
          location.href = `${PROTOCOL}://${DOMAIN}/payment/paypal-confirming?id=${data.paymentID}`
        })
        .catch(() => {
          safeAlert('Something went wrong. Please check your internet connection.')
          handlePageIsLoading(false)
        })
    }

    const onCancel = () => {
      if (hideCheckoutModal) {
        hideCheckoutModal()
      }
    }

    const onError = (error) => {
      console.log(error)
      safeAlert('Something went wrong. Please check your internet connection.')
    }

    return (
      <React.Fragment>
        {
          addButtonToDOM &&
            <div
              className='paypal-button'
              style={{
                display: showButton ? 'block' : 'none'
              }}>
              {
                addButtonToDOM &&
                // eslint-disable-next-line
                // @ts-ignore
                // eslint-disable-next-line
                <paypal.Button.react
                  client={client}
                  commit={commit}
                  env={env}
                  onAuthorize={onAuthorize}
                  onCancel={onCancel}
                  onError={onError}
                  payment={payment}
                  style={{ size: 'large' }} />
              }
            </div>
        }
        {
          !showButton &&
            <div className='paypal-button-loading'>
              <FontAwesomeIcon icon='spinner' spin />
            </div>
        }
      </React.Fragment>
    )
  }
}

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
