import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getPayPalOrderById } from '~/services/paypal'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Footer, Icon, Meta, PageHeader, PageScrollableContent } from '~/components'
import { useTranslation } from 'react-i18next'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

let isCheckingInterval = null

export default function PaymentPayPalConfirming(props: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { paymentID } = router.query
  const { t } = useTranslation()
  const [isChecking, setIsChecking] = useState<boolean>(true)
  const [didError, setDidError] = useState<boolean>(false)
  const [wasSuccessful, setWasSuccessful] = useState<boolean>(false)
  const currentCount = useRef<number>(0)

  /* useEffects */

  useEffect(() => {
    isCheckingInterval = setInterval(() => {
      checkPaymentStatus()
    }, 5000)

    return () => {
      clearInterval(isCheckingInterval)
    }
  }, [])

  /* Function Helpers */

  const checkPaymentStatus = async () => {
    try {
      const paypalOrder = await getPayPalOrderById(paymentID as string)

      if (paypalOrder?.data?.state === 'completed') {
        clearInterval(isCheckingInterval)
        setWasSuccessful(true)
        setIsChecking(false)
        setTimeout(() => {
          router.push(`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.membership}`)
        }, 3000)
      } else if (currentCount.current > 12) {
        clearInterval(isCheckingInterval)
        setDidError(true)
        setIsChecking(false)
      }
    } catch (error) {
      console.log(error)
    }

    currentCount.current = currentCount.current + 1
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.payment_paypal_confirming}`,
    description: t('pages-payment_paypal_confirming_Description'),
    title: t('pages-payment_paypal_confirming_Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Processing Payment')} />
      <PageScrollableContent>
        <div className='flex-centered-content-wrapper'>
          {isChecking && (
            <>
              <p>Confirming PayPal payment...</p>
              <Icon faIcon={faSpinner} spin />
              <p>This may take a minute...</p>
            </>
          )}
          {didError && (
            <>
              <p>Sorry! Something went wrong.</p>
              <p>
                Please check your internet connection, or go to the{' '}
                <a href={PV.RoutePaths.web.membership}>Membership</a> page to check if your purchase was successful.
              </p>
              <p>
                If the problem continues, please email{' '}
                <a href={`mailto:${PV.Config.EMAIL.CONTACT}`}>{PV.Config.EMAIL.CONTACT}</a> for help.
              </p>
            </>
          )}
          {wasSuccessful && (
            <>
              <p>Payment confirmed!</p>
              <p>Redirecting to your Settings page...</p>
            </>
          )}
        </div>
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
