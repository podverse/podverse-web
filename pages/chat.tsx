/* eslint-disable @next/next/no-sync-scripts */
import { GetServerSideProps } from 'next'
import Script from 'next/script'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { Meta } from '~/components/Meta/Meta'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

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
            allow_registration: false,
            archived_messages_page_size: 100,
            auto_away: 600,
            auto_list_rooms: true,
            auto_login: true,
            auto_join_rooms: [
              'general@groups.chat.podverse.fm',
              'dev@groups.chat.podverse.fm',
              'translations@groups.chat.podverse.fm'
            ],
            auto_reconnect: true,
            bosh_service_url: 'https://chat.podverse.fm/http-bind/',
            notify_all_room_messages: true,
            notification_delay: 20000,
            notification_icon: 'https://podverse.fm/images/android-chrome-192x192.png',
            play_sounds: true,
            view_mode: 'fullscreen'
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
      <Script id='converse.min.js' src='https://cdn.conversejs.org/dist/converse.min.js' />
      <Script id='libsignal-protocol.min.js' src='https://cdn.conversejs.org/3rdparty/libsignal-protocol.min.js' />
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
