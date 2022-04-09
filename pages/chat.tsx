/* eslint-disable @next/next/no-sync-scripts */
import { GetServerSideProps } from 'next'
import Script from 'next/script'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { useEffect } from 'react'
import { Meta } from '~/components/Meta/Meta'
import { PageLoadingOverlay } from '~/components'
import { appendRemoteScript } from '~/lib/utility/misc'
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
      OmniAural.pageIsLoadingShow()
      const initConverseInterval = setInterval(() => {
        if (window.converse && window.mermaid) {
          clearInterval(initConverseInterval)

          appendRemoteScript('/3rd-party/converse/packages/actions/actions.js')
          appendRemoteScript('/3rd-party/converse/packages/diagrams/diagrams.js')
          appendRemoteScript('/3rd-party/converse/packages/muc-presence-probe/src/muc-presence-probe.js')

          setTimeout(() => {
            window.converse.initialize({
              allow_registration: false,
              archived_messages_page_size: 100,
              assets_path: '/3rd-party/converse/dist/',
              auto_away: 600,
              auto_list_rooms: true,
              auto_join_rooms: [
                'general@groups.chat.podverse.fm',
                'dev@groups.chat.podverse.fm',
                'translations@groups.chat.podverse.fm'
              ],
              bosh_service_url: 'https://chat.podverse.fm/http-bind/',
              notify_all_room_messages: true,
              notification_delay: 20000,
              notification_icon: '/images/android-chrome-192x192.png',
              play_sounds: true,
              sounds_path: '/3rd-party/converse/dist/sounds/',
              view_mode: 'fullscreen',
              whitelisted_plugins: [
                'actions',
                'converse-bookmarks',
                'converse-chatboxes',
                'converse-chatview',
                'converse-controlbox',
                'converse-core',
                'converse-debug',
                'converse-disco',
                'converse-dragresize',
                'converse-emoji',
                'converse-fullscreen',
                'converse-headline',
                'converse-mam',
                'converse-minimize',
                'converse-muc',
                'converse-muc-embedded',
                'converse-notification',
                'converse-ping',
                'converse-profile',
                'converse-register',
                'converse-roomslist',
                'converse-rosterview',
                'converse-singleton',
                'converse-spoilers',
                'converse-vcard',
                'diagrams',
                'muc-presence-probe'
              ]
            })
            OmniAural.pageIsLoadingHide()
          }, 1500)
        }
      }, 250)
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
      <Script async={false} id='mermaid.js' src='https://cdnjs.cloudflare.com/ajax/libs/mermaid/9.0.0/mermaid.min.js' />
      <Script
        async={false}
        id='libsignal-protocol.min.js'
        src='https://cdn.conversejs.org/3rdparty/libsignal-protocol.js'
      />
      <Script async={false} id='converse.min.js' src='/3rd-party/converse/dist/converse.js' />

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

      <PageLoadingOverlay />
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
