import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ButtonRectangle,
  ColumnsWrapper,
  ComparisonTable,
  Footer,
  MembershipStatus,
  Meta,
  PageHeader,
  PageScrollableContent
} from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

type ServerProps = Page

export default function Membership(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.membership}`,
    description: t('pages-membership_Description'),
    title: t('pages-membership_Title')
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
      <PageHeader text={t('Membership')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <MembershipStatus />
              <ComparisonTable
                aboveSectionNodes={
                  <>
                    <p>
                      {t('Enjoy Podverse Premium')}
                      <br />
                      {t('3 months free')}
                      <br />
                      {t('18 per year after that')}
                    </p>
                    <div className='button-column'>
                      {!userInfo && (
                        <ButtonRectangle
                          label={t('Login')}
                          onClick={() => OmniAural.modalsLoginShow()}
                          type='primary'
                        />
                      )}
                      {userInfo && (
                        <ButtonRectangle
                          isSuccess
                          label={t('Renew Membership')}
                          onClick={() => OmniAural.modalsCheckoutShow()}
                          type='primary'
                        />
                      )}
                    </div>
                  </>
                }
                featuresData={featuresData(t)}
                headerIcon1={t('Free')}
                headerIcon2={t('Premium')}
                headerText={t('Features')}
              />
            </div>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

const featuresData = (t) => [
  {
    text: t('features - subscribe to podcasts'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - download episodes'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - video playback'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - sleep timer'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 chapters'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 cross-app comments'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 transcripts'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - opml import and export'),
    icon1: true,
    icon2: true
  },
  // TODO: the web app hasn't been audited and updated for
  // screen-reader accessibility, but the mobile app has.
  // {
  //   text: t('features - screen-reader accessibility'),
  //   icon1: true,
  //   icon2: true
  // },
  {
    text: t('features - sync your subscriptions and queue across all your devices'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - create and share podcast clips'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - create and share playlists'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - mark episodes as played'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - subscribe to listener profiles'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - support open source software'),
    icon1: true,
    icon2: true,
    iconType: 'smile'
  }
]

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
