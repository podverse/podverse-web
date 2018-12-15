import * as React from 'react'

export interface Props {
  handleHideModal?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isNSFWModeOn?: boolean
  isOpen?: boolean
}

export const PayPalButton: React.StatelessComponent<Props> = props => {
    
  // @ts-ignore
  const paypal = process.browser ? require('paypal-checkout') : null

  return (
    <React.Fragment>
      {
        // @ts-ignore
        process.browser &&
          <React.Fragment>
            <div id="paypal-button"></div>
            {
              // Render the button into the container element
              paypal.Button.render({
                
                // Pass the client ids to use to create your transaction on sandbox and production environment
                client: {
                  sandbox: 'xxxxxxxxx', // from https://developer.paypal.com/developer/applications/
                  production: 'xxxxxxxxx'  // from https://developer.paypal.com/developer/applications/
                },
                
                // Pass the payment details for your transaction
                // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
                payment (data, actions) {
                  return actions.payment.create({
                    transactions: [{
                      amount: {
                        total: '1.00',
                        currency: 'USD'
                      }
                    }]
                  });
                },
                
                // Display a "Pay Now" button rather than a "Continue" button
                commit: true,
                
                // Pass a function to be called when the customer completes the payment
                onAuthorize (data, actions) {
                  return actions.payment.execute().then(response => {
                    console.log('The payment was completed!')
                  });
                },
                
                // Pass a function to be called when the customer cancels the payment
                onCancel (data) {
                  console.log('The payment was cancelled!')
                }
              }, '#paypal-button')
            }
        </React.Fragment>
      }
    </React.Fragment>
  )
}
