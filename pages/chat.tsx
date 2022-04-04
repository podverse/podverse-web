/* eslint-disable @next/next/no-sync-scripts */
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
        if (window.converse?.initialize) {
          window.converse.initialize({
            bosh_service_url: 'https://chat.podverse.fm/http-bind/',
            view_mode: 'fullscreen',
            auto_join_rooms: [
              'general@groups.chat.podverse.fm',
              'dev@groups.chat.podverse.fm',
              'translations@groups.chat.podverse.fm'
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
        <script src='https://cdn.conversejs.org/9.0.0/dist/converse.min.js' charSet='utf-8'></script>
        <script src='https://cdn.conversejs.org/3rdparty/libsignal-protocol.min.js' />
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
