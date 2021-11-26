import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OmniAural from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'
import { MessageWithAction, Meta, PageHeader, PageScrollableContent } from '~/components'

interface ServerProps extends Page { }

const keyPrefix = 'pages_my_profile'

export default function MyProfile(props: ServerProps) {

  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.my_profile}`,
    description: t('pages:my_profile._Description'),
    title: t('pages:my_profile._Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title} />
      <PageHeader text={t('My Profile')} />
      <PageScrollableContent noMarginTop>
        <MessageWithAction
          actionLabel={t('Login')}
          actionOnClick={() => OmniAural.modalsLoginShow()}
          message={t('LoginToViewYourProfile')} />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)

  if (userInfo) {
    return {
      redirect: {
        destination: `${PV.RoutePaths.web.profile}/${userInfo.id}`,
        permanent: false
      }
    }
  }

  const userQueueItems = await getServerSideUserQueueItems(cookies)

  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverCookies: cookies
  }

  return { props: serverProps }
}
