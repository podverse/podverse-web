import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, DownloadAppButtons, FeatureComparisonTable, Footer, PageHeader, PageScrollableContent } from '~/components'
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
    title: t('pages-about_Title')
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
      <PageHeader text={t('About')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p className='bigger'>Podverse is an open source podcast manager for iOS, Android, and web.</p>
              <DownloadAppButtons />
              <p>
                All Podverse software is provided under a free and open source (FOSS) licence. Features that require
                updating our servers are available only with a Premium membership. Sign up today and get 3 months of
                Premium for free{' '}
                <span role='img' aria-label='partying face emoji'>
                  🥳
                </span>
              </p>
              <FeatureComparisonTable leftAlignedStyle />
              <hr />
              <h3>Team</h3>
              <p>Mitch Downey</p>
              <p>Creon Creonopoulos</p>
              <p>Gary Johnson</p>
              <p>Kyle Downey</p>
            </div>
          }
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
