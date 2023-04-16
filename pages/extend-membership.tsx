import { GetServerSideProps } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ColumnsWrapper,
  DownloadAppButtons,
  FeatureComparisonTable,
  Footer,
  PVLink,
  PageHeader,
  PageScrollableContent,
  SideContent
} from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function About(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.about}`,
    description: t('pages-about_Description'),
    title: t('pages-extend-membership_Title')
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
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Extend Membership')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p>{t('Extend Membership Text')}</p>
              <p>{t('Extend Membership Text 2')}</p>
              <p>{t('Extend Membership Text 3')}</p>
              <DownloadAppButtons hideFDroid />
              <p>
                <Trans
                  i18nKey="Extend Membership Text 4"
                  t={t}
                  components={[
                    <PVLink className='footer-link-contribute' href='/contribute' key="contribute">{}</PVLink>
                  ]}
                  values={{ contributePage: t('Contribute page')}}
                />
              </p>
            </div>
          }
          sideColumnChildren={<SideContent />}
        />
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
