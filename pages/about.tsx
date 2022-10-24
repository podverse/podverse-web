import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ColumnsWrapper,
  DownloadAppButtons,
  FeatureComparisonTable,
  Footer,
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
              <p className='bigger'>{t('Podverse is a FOSS podcast manager')}</p>
              <DownloadAppButtons />
              <p>
                {t('License and free trial info')}{' '}
                <span role='img' aria-label='partying face emoji'>
                  🥳
                </span>
              </p>
              <FeatureComparisonTable leftAlignedStyle />
              <hr />
              <h3>Team</h3>
              <p>
                <a href='https://github.com/mitchdowney' target='_blank' rel='noreferrer'>
                  Mitch Downey
                </a>
              </p>
              <p>
                <a href='https://github.com/kreonjr' target='_blank' rel='noreferrer'>
                  Creon Creonopoulos
                </a>
              </p>
              <p>
                <a href='https://podverse.fm' target='_blank' rel='noreferrer'>
                  Gary Johnson
                </a>
              </p>
              <p>
                <a href='https://github.com/kylefdowney' target='_blank' rel='noreferrer'>
                  Kyle Downey
                </a>
              </p>
              <p>
                <a href='https://github.com/suorcd' target='_blank' rel='noreferrer'>
                  Archie Brentano
                </a>
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
