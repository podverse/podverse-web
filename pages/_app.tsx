import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural from 'omniaural'
import React, { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import Modal from 'react-modal'
import { Modals, NavBar, HorizontalNavBar, Player, PageLoadingOverlay, PlayerAPI } from '~/components'
import '~/state'
import initialState from '~/state/initialState.json'
import { playerLoadNowPlayingItem, saveCurrentPlaybackPositionToHistory } from '~/services/player/player'
import { getNowPlayingItemOnServer } from '~/services/userNowPlayingItem'

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
  window.onbeforeunload = () => {
    saveCurrentPlaybackPositionToHistory()
    // prevent dialog alert by returning undefined
    return undefined
  }
}

function MyApp({ Component, pageProps }) {
  const { serverHistoryItemsIndex = {
    "episodes": {},
    "mediaRefs": {}
  }, serverUserInfo = null, serverUserQueueItems = [] } = pageProps
  OmniAural.setUserInfo(serverUserInfo)
  OmniAural.setUserQueueItems(serverUserQueueItems)
  OmniAural.setHistoryItemsIndex(serverHistoryItemsIndex)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', OmniAural.pageIsLoadingShow)
    router.events.on('routeChangeComplete', OmniAural.pageIsLoadingHide)
    return () => {
      router.events.off('routeChangeComplete', OmniAural.pageIsLoadingHide),
        router.events.off('routeChangeComplete', OmniAural.pageIsLoadingHide)
    }
  }, [router.events])

  useEffect(() => {
    ;(async () => {
      const nowPlayingItem = await getNowPlayingItemOnServer()
      if (nowPlayingItem) {
        const shouldPlay = false
        playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
      }
    })()
  }, [])

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
