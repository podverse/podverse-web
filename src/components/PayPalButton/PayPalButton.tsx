import * as React from 'react'
import * as ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'

type Props = {
  client?: string
  commit?: string
  currency?: string
  env?: string
  isScriptLoaded?: boolean
  isScriptLoadSucceed?: boolean
  onCancel: Function
  onError: Function
  onSuccess: Function
  total?: number
}

type State = {
  showButton?: any
}

class PaypalButton extends React.Component<Props, State> {
  constructor (props) {
    super(props);

    this.state = {
      showButton: false,
    }

    //@ts-ignore
    window.React = React
    //@ts-ignore
    window.ReactDOM = ReactDOM
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps

    const isLoadedButWasntLoadedBefore = !this.state.showButton &&
      !this.props.isScriptLoaded && isScriptLoaded

    if (isLoadedButWasntLoadedBefore && isScriptLoadSucceed) {
      this.setState({ showButton: true })
    }
  }

  render () {
    const { client, commit, currency, env, onCancel, onError, onSuccess, total } = this.props
    const { showButton } = this.state

    const payment = () => (
      // @ts-ignore
      paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: {
              total,
              currency
            }
          }
        ]
      })
    )
    
    const onAuthorize = (data, actions) =>
      actions.payment.execute()
        .then(() => {
          const payment = {
            paid: true,
            cancelled: false,
            payerID: data.payerID,
            paymentID: data.paymentID,
            paymentToken: data.paymentToken,
            returnUrl: data.returnUrl
          }

          onSuccess(payment)
        })

    return (
      <div>
        {
          showButton && 
            // @ts-ignore
            <paypal.Button.react
              client={client}
              commit={commit}
              onAuthorize={onAuthorize}
              onCancel={onCancel}
              onError={onError}
              payment={payment} />
        }
      </div>
    )
  }
}

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
