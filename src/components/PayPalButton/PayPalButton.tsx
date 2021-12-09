import router from 'next/router'
import OmniAural from 'omniaural'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTranslation } from 'react-i18next'
import { PV } from '~/resources'
import { createPayPalOrder } from '~/services/paypal'

type Props = unknown

let PayPalButtonFromLibrary: any = null

export const PayPalButton = (props: Props) => {
  const { t } = useTranslation()
  const [paypalSDKReady, setPayPalSDKReady] = useState<boolean>(false)

  /* useEffects */

  useEffect(() => {
    const script = document.createElement('script')
    const paypalClientId =
      PV.Config.PAYPAL_CLIENT.env === 'production'
        ? PV.Config.PAYPAL_CLIENT.production
        : PV.Config.PAYPAL_CLIENT.sandbox
    script.src = `https://www.paypal.com/sdk/js?disable-funding=paylater&client-id=${paypalClientId}`
    script.defer = true

    script.onload = () => {
      PayPalButtonFromLibrary = window.paypal.Buttons.driver('react', { React, ReactDOM })
      setPayPalSDKReady(true)
    }

    script.onerror = () => {
      throw new Error('PayPal integration could not be loaded.')
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  /* Function Helpers */

  const onApprove = (data, actions) => {
    OmniAural.pageIsLoadingShow()
    return actions.order.capture().then(async function (details) {
      const paymentID = details.purchase_units[0].payments.captures[0].id
      await createPayPalOrder({ paymentID })
      router.push(`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.payment_paypal_confirming}/${paymentID}`)
      OmniAural.modalsHideAll()
    })
  }

  const onCancel = () => {
    OmniAural.modalsHideAll()
  }

  const onError = () => {
    alert(t('errorMessages:alerts.somethingWentWrong'))
  }

  return (
    <div className='paypal-button'>
      {paypalSDKReady && (
        <PayPalButtonFromLibrary
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              payer: {
                payment_method: 'paypal'
              },
              purchase_units: [
                {
                  amount: {
                    value: '10.00'
                  }
                }
              ],
              application_context: {
                brand_name: 'Podverse',
                locale: 'en',
                landing_page: 'LOGIN',
                shipping_preference: 'NO_SHIPPING'
              }
            })
          }}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onError}
          style={{ size: 'large' }}
        />
      )}
    </div>
  )
}
