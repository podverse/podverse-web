import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, MailTo, Meta, PageHeader, PageScrollableContent, PVLink } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

const emailContact = 'contact@podverse.fm'
const bugReportSubject = 'Bug Report: '
const bugReportBody = 'Please include your browser and operating system with your bug report.'
const featureRequestSubject = 'Feature Request: '
const featureRequestBody = 'Please describe the feature you would like added to Podverse.'
const podcastRequestSubject = 'Podcast Request: '
const podcastRequestBody = 'Please provide the name of the podcast, and the name of the host if you know it.'
const reportAContentIssueSubject = 'Content Issue Report: '
const reportAContentIssueBody = 'To help expedite our response, please provide a link on Podverse to the content that you are reporting.'
const generalSubject = 'General: '
const generalBody = ''

export default function Contact(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.contact}`,
    description: t('pages-contact_Description'),
    title: t('pages-contact_Title')
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
      <PageHeader text={t('Contact')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <h2 tabIndex={0}>{t('Email')}</h2>
              <h3>
                <MailTo body={bugReportBody} email={emailContact} subject={bugReportSubject}>
                  {t('Bug Report')}
                </MailTo>
              </h3>
              <h3>
                <MailTo body={featureRequestBody} email={emailContact} subject={featureRequestSubject}>
                  {t('Feature Request')}
                </MailTo>
              </h3>
              <h3>
                <MailTo body={podcastRequestBody} email={emailContact} subject={podcastRequestSubject}>
                  {t('Podcast Request')}
                </MailTo>
              </h3>
              <h3>
                <MailTo body={reportAContentIssueBody} email={emailContact} subject={reportAContentIssueSubject}>
                  {t('Report a content issue')}
                </MailTo>
              </h3>
              <h3>
                <MailTo body={generalBody} email={emailContact} subject={generalSubject}>
                  {t('General')}
                </MailTo>
              </h3>
              <hr />
              <h2 tabIndex={0}>{t('Live Chat')}</h2>
              <h3>
                <PVLink href={PV.Contact.matrixInvite}>{t('Join our Matrix space')}</PVLink>
              </h3>
              <h3>
                <PVLink href='/xmpp'>{t('Join our XMPP server')}</PVLink>
              </h3>
              <h3>
                <a href={PV.Contact.discordInvite} target='_blank' rel='noreferrer'>
                  {t('Join our Discord')}
                </a>
              </h3>
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
