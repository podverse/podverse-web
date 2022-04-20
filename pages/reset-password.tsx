import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Meta, PasswordInputs } from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { resetPassword } from '~/services/auth'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function ResetPassword(props: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const { token } = router.query

  /* Function Helpers */

  const _handleClose = () => {
    router.push('/')
  }

  const _handleResetPassword = async (email, password) => {
    try {
      await resetPassword(password, token as string)
      alert(t('Reset password successful'))
      router.push('/')
    } catch (error) {
      alert(t('errorMessages:internetConnectivityErrorMessage'))
    }
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.reset_password}`,
    description: t('pages-reset_password_Description'),
    title: t('pages-reset_password_Title')
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
      <div className='form-wrapper'>
        <h2 tabIndex={0}>{t('Reset Password')}</h2>
        <PasswordInputs handleClose={_handleClose} handleSubmit={_handleResetPassword} hideEmail />
      </div>
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
