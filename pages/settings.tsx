import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Meta } from '~/components'
import { PV } from '~/resources'

export default function Settings() {

  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.settings}`,
    description: t('pages:settings._Description'),
    title: t('pages:settings._Title')
  }

  return (
    <div>
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
      <p>settings!!!</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  return {
    props: {
      ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
      serverCookies: cookies
    }
  }
}
