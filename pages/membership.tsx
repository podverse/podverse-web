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

  const ariaTopText = `${t('Enjoy Podverse Premium')} ${t('3 months free')}, ${t('18 per year after that')}`

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
            <div className='text-page top-margin-below-tablet-max-width'>
              <MembershipStatus />
              <ComparisonTable
                aboveSectionNodes={
                  <>
                    <p aria-label={ariaTopText} tabIndex={0}>
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
                headerText1={t('Free')}
                headerText2={t('Premium')}
                headerText={t('Features')}
                legendAsterisk={t('Feature is only available in the mobile app')}
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
    icon1Asterisk: true,
    icon2: true
  },
  {
    text: t('features - download episodes'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - video playback'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - sleep timer'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
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
  {
    text: t('features - screen-reader accessibility'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - Sync your subscriptions, queue, and history across all your devices'),
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
