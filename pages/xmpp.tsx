import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, Meta, PageHeader, PageScrollableContent } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function XMPP(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.xmpp}`,
    description: t('pages-xmpp_Description'),
    title: t('pages-xmpp_Title')
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
      <PageHeader text={'XMPP'} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <p>{t('ContactXMPPText1')}</p>
              {/* <p>
                {t('ContactXMPPText2')}
                <br />
                <PVLink href={PV.RoutePaths.web.chat}>{t('Open web chat')}</PVLink>
              </p> */}
              <p>
                {t('ContactXMPPChatRooms')}:<br />
                <a href='xmpp:general@chat.podverse.fm'>general@chat.podverse.fm</a>
                <br />
                <a href='xmpp:dev@chat.podverse.fm'>dev@chat.podverse.fm</a>
                <br />
                <a href='xmpp:translations@chat.podverse.fm'>translations@chat.podverse.fm</a>
              </p>
              <p>
                {t('brandName chat is powered by')}:<br />
                <a href='https://prosody.im/'>Prosody</a>
                <br />
                <a href='https://snikket.org'>Snikket</a>
                <br />
                <a href='https://conversejs.org/'>Converse</a>
              </p>
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
