import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, DownloadAppButtons, PageHeader, PageScrollableContent, SideContent } from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

interface ServerProps extends Page {}

const keyPrefix = 'pages_about'

export default function About(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.about}`,
    description: t('pages:about._Description'),
    title: t('pages:about._Title')
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
              <label>Free features:</label>
              <ul>
                <li>Subscribe to podcasts</li>
                <li>Auto-download episodes</li>
                <li>Drag-and-drop queue</li>
                <li>Sleep timer</li>
                <li>Light / Dark mode</li>
              </ul>
              <label>Premium features:</label>
              <ul>
                <li>Create and share podcast clips</li>
                <li>Switch devices and play from where you left off</li>
                <li>Sync your subscriptions across devices</li>
                <li>Sync your queue across devices</li>
                <li>Create and share playlists</li>
                <li>Subscribe to playlists</li>
              </ul>
              <p>
                All Podverse software is provided under a free and open source (FOSS) licence. Features that require
                updating our servers are available only with a Premium membership. Sign up today and get 1 year of
                Premium for free{' '}
                <span role='img' aria-label='partying face emoji'>
                  🥳
                </span>
              </p>
              <DownloadAppButtons />
              <hr />
              <h3>Team</h3>
              <p>Mitch Downey</p>
              <p>Creon Creonopoulos</p>
              <p>Gary Johnson</p>
              <p>Kyle Downey</p>
            </div>
          }
          sideColumnChildren={<SideContent />}
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
