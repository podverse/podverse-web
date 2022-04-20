import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, MailTo, Meta, PageHeader, PageScrollableContent, PVLink } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function Support(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.support}`,
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
      <PageHeader text={t('Support')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p>Podverse creates free and open source software to expand what is possible in podcasting.</p>
              <p>Below are a few ways you can support the project:</p>
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
                
              </p>
              <p>
                {t('Bitcoin Lighning Node Address')}
                <br />
                
              </p>
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
              <p>Here is a partial list of tasks we could use help with:</p>
              <ul>
                <li>Share with friends and family!</li>
                <li>Translations</li>
                <li>Creating Memes</li>
                <li>QA Testing</li>
                <li>Graphic Design</li>
                <li>Social Media Marketing</li>
                <li>Programming</li>
                <li>SEO</li>
                <li>Other ideas?</li>
              </ul>
              <p>
                {`If you're interested in helping Podverse in any capacity, please `}
                <a href='https://discord.gg/6HkyNKR' target='_blank' rel='noreferrer'>
                  {t('join our Discord server')}
                </a>{' '}
                or <MailTo email='contact@podverse.fm'>{t('send us an email')}</MailTo>.
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
