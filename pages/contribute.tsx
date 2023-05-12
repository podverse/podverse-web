import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, Meta, PageHeader, PageScrollableContent, PVLink } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function Contribute(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.contribute}`,
    description: t('pages-support_Description'),
    title: t('pages-support_Title')
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
      <PageHeader text={t('Contribute')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p>{t('Mission statement')}</p>
              <p>{t('Below are a few ways you can support the project')}</p>
              <br />
              <h3>{t('Membership')}</h3>
              <p>
                <PVLink href='/membership'>{t('Buy a Podverse premium membership')}</PVLink>
              </p>
              <br />
              <h3>{t('Donate')}</h3>
              <p>
                {t('Bitcoin Wallet Address')}
                <br />
                {'bc1qqme0tj5gutgujsz62xqcfc6emfgm5wky27zc30'}
                <br />
              </p>
              <p>
                {t('Bitcoin Lightning Alby address')}
                <br />
                {'podverse@getalby.com'}
              </p>
              {/* <p>
                {t('Bitcoin Lighning Node Address')}
                <br />
              </p> */}
              <p>
                <a href='https://www.paypal.com/donate?hosted_button_id=YKMNUDUCRTUPC' target='_blank' rel='noreferrer'>
                  {t('Donate with PayPal')}
                </a>
              </p>
              <p>
                <a href='https://www.patreon.com/podverse' target='_blank' rel='noreferrer'>
                  {t('Donate with Patreon')}
                </a>
              </p>
              <br />
              <h3>{t('Contribute')}</h3>
              <p>
                {t(`Contribute info`)}
                <p>
                  <PVLink href='/contact'>{t('Contact')}</PVLink>
                </p>
              </p>
              <br />
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
