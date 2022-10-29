import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ButtonRectangle,
  ColumnsWrapper,
  FeatureComparisonTable,
  FeatureDemoWidget,
  Footer,
  MembershipStatus,
  Meta,
  PageHeader,
  PageScrollableContent,
  SideContent
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
    description: t('pages-about_Description'),
    title: t('pages-membership_Title')
  }

  const ariaTopText = `${t('Enjoy Podverse Premium')} ${t('3 months free')}, ${t('18 per year after that')}`

  const aboveSectionNodes = (
    <>
      <p aria-label={ariaTopText} tabIndex={0}>
        {t('Enjoy Podverse Premium')}
        <br />
        {t('3 months free')}
        <br />
        {t('18 per year after that')}
      </p>
      <div className='button-column'>
        {!userInfo && <ButtonRectangle label={t('Login')} onClick={() => OmniAural.modalsLoginShow()} type='primary' />}
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
  )

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
              <FeatureComparisonTable aboveSectionNodes={aboveSectionNodes} />
              <FeatureDemoWidget
                centered
                marginTopExtra
                tutorialsLink='/tutorials'
                tutorialsLinkText={t('tutorials link - tutorials')}
              />
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
