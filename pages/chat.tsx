import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Meta } from '~/components/Meta/Meta'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { useEffect } from 'react'
import Head from 'next/head'

type ServerProps = Page

export default function Chat() {
  /* Initialize */

  const { t } = useTranslation()

  /* Hooks */

  useEffect(() => {
    ;(async () => {
      const initConverseInterval = setInterval(() => {
        // console.log('interval', converse)
        if (window.converse?.initialize) {
          window.converse.initialize({
            bosh_service_url: 'https://chat.podverse.fm/http-bind/',
            view_mode: 'fullscreen',
            auto_join_rooms: [
              { 'jid': 'dev@groups.chat.podverse.fm', 'name': 'dev', 'minimized': true },
              { 'jid': 'general_public@groups.chat.podverse.fm', 'name': 'general', 'minimized': true },
              { 'jid': 'translations@groups.chat.podverse.fm', 'name': 'translations', 'minimized': true },
            ]
          })
          clearInterval(initConverseInterval)
        }
      }, 50)
    })()
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.chat}`,
    description: t('pages-chat_Description'),
    title: t('pages-chat_Title')
  }

  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          type='text/css'
          media='screen'
          href='https://cdn.conversejs.org/9.0.0/dist/converse.min.css'
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src='https://cdn.conversejs.org/9.0.0/dist/converse.min.js' charSet='utf-8'></script>
      </Head>
      <Meta
        description={meta.description}
        isVideo
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
      />
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
