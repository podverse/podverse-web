import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Icon, Meta, PageHeader, PageScrollableContent } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { useEffect, useState } from 'react'
import { verifyEmail } from '~/services/auth'
import { useRouter } from 'next/router'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ServerProps extends Page { }

const keyPrefix = 'pages_verify_email'

export default function VerifyEmail(props: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState<boolean>(true)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    ; (async () => {
      try {
        setIsVerifying(true)
        const { token } = router.query
        await verifyEmail(token as string)
        setIsVerified(true)
        
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } catch (error) {
        console.log('verifyEmail error', error)
        setHasError(true)
      }
      setIsVerifying(false)
    })()
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.verify_email}`,
    description: t('pages:verify_email._Description'),
    title: t('pages:verify_email._Title')
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
      <PageHeader text={'Verify Email'} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              {
                isVerifying && (
                  <>
                    <h3>{t('Verifying your email address')}</h3>
                    <Icon faIcon={faSpinner} spin />
                  </>
                )
              }
              {
                isVerified && (
                  <h3>{t('Email verified redirecting to home page')}</h3>
                )
              }
              {
                hasError && (
                  <>
                    <h3>{t('Something went wrong')}</h3>
                  </>
                )
              }
            </div>
          }
        />
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
