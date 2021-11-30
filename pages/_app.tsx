import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural from "omniaural"
import React, { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import Modal from 'react-modal'
import { Modals, NavBar, HorizontalNavBar, Player, PageLoadingOverlay, PlayerAPI } from '~/components'
import "~/state"
import initialState from "~/state/initialState.json"
import { saveCurrentPlaybackPositionToHistory } from '~/services/player/player'

declare global {
  /* *TODO* add proper types for global interfaces */
  interface Window {
    paypal: any
    playerAudio: any
  }
  interface Date {
    addDays: any
  }
}

OmniAural.initGlobalState(initialState)

fontAwesomeConfig.autoAddCss = false

Modal.setAppElement('.app')

if (typeof window !== 'undefined') {
  window.onbeforeunload = async () => {
    saveCurrentPlaybackPositionToHistory()
  }
}

function MyApp({ Component, pageProps }) {
  const { serverUserInfo, serverUserQueueItems } = pageProps
  OmniAural.setUserInfo(serverUserInfo)
  OmniAural.setUserQueueItems(serverUserQueueItems)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', OmniAural.pageIsLoadingShow)
    router.events.on('routeChangeComplete', OmniAural.pageIsLoadingHide)
    return () => {
      router.events.off('routeChangeComplete', OmniAural.pageIsLoadingHide),
      router.events.off('routeChangeComplete', OmniAural.pageIsLoadingHide)
    }
  }, [router.events])

  return (
    <CookiesProvider>
      <div className='app'>
        <div className='app-wrapper'>
          <NavBar />
          <div className='app-main-wrapper'>
            <HorizontalNavBar serverCookies={pageProps.serverCookies || {}} />
            <main>
              <Component {...pageProps} />
            </main>
          </div>
        </div>
        <PlayerAPI />
        <Player />
        <Modals />
        <PageLoadingOverlay />
      </div>
    </CookiesProvider>
  )
}

export default appWithTranslation(MyApp)
