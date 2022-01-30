import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural from 'omniaural'
import { NowPlayingItem } from 'podverse-shared'
import React, { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import { unstable_batchedUpdates } from 'react-dom'
import Modal from 'react-modal'
import { ToastProvider } from 'react-toast-notifications'
import {
  MobilePlayer,
  Modals,
  NavBar,
  HorizontalNavBar,
  Player,
  PageLoadingOverlay,
  PlayerAPI,
  MobileNavBar,
  V4VHiddenElement,
  ToastsHandler
} from '~/components'
import '~/state'
import initialState from '~/state/initialState.json'
import { playerLoadNowPlayingItem, saveCurrentPlaybackPositionToHistory } from '~/services/player/player'
import { getNowPlayingItemOnServer } from '~/services/userNowPlayingItem'
import { initializeMatomo, matomoTrackPageView } from '~/services/tracking'

declare global {
  /* *TODO* add proper types for global interfaces */
  interface Window {
    _paq: any
    __v4v: {
      currentPage: {
        item: NowPlayingItem | null
      }
      playerInfo: {
        item: NowPlayingItem | null
        playbackPosition: number
      }
    }
    Matomo: any
    paypal: any
    playerAudio: any
    playerVideo: any
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
    const skipSetNowPlaying = true
    saveCurrentPlaybackPositionToHistory(skipSetNowPlaying)
    // prevent dialog alert by returning undefined
    return undefined
  }
}

function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const doNotInheritAppComponent = router.pathname.startsWith('/miniplayer')

  useEffect(() => {
    if (!doNotInheritAppComponent) {
      router.events.on('routeChangeStart', _routeChangeStart)
      router.events.on('routeChangeComplete', _routeChangeComplete)
      return () => {
        router.events.off('routeChangeStart', _routeChangeStart),
          router.events.off('routeChangeComplete', _routeChangeComplete)
      }
    }
  }, [router.events])

  useEffect(() => {
    ; (async () => {
      if (!doNotInheritAppComponent) {
        const nowPlayingItem = await getNowPlayingItemOnServer()
        if (nowPlayingItem) {
          const shouldPlay = false
          unstable_batchedUpdates(() => {
            playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
          })
        }
  
        initializeMatomo()
        matomoTrackPageView()
      }
    })()
  }, [])

  const _routeChangeStart = () => {
    OmniAural.pageIsLoadingShow()
  }

  const _routeChangeComplete = () => {
    OmniAural.pageIsLoadingHide()
    matomoTrackPageView()
  }

  if (router.pathname.startsWith('/miniplayer')) {
    return (
      <div className='app'>
        <Component {...pageProps} />
      </div>
    )
  } else {
    const {
      serverHistoryItemsIndex = {
        episodes: {},
        mediaRefs: {}
      },
      serverUserInfo = null,
      serverUserQueueItems = []
    } = pageProps
    OmniAural.setUserInfo(serverUserInfo)
    OmniAural.setUserQueueItems(serverUserQueueItems)
    OmniAural.setHistoryItemsIndex(serverHistoryItemsIndex)

    return (
      <CookiesProvider>
        <ToastProvider>
          <div className='app'>
            <MobileNavBar />
            <div className='app-wrapper'>
              <NavBar />
              <div className='app-main-wrapper'>
                <HorizontalNavBar serverCookies={pageProps.serverCookies || {}} />
                <main>
                  <Component {...pageProps} />
                </main>
              </div>
            </div>
            <V4VHiddenElement />
            <Modals />
            <PageLoadingOverlay />
            <Player />
            <MobilePlayer />
            <PlayerAPI />
            <ToastsHandler />
          </div>
        </ToastProvider>
      </CookiesProvider>
    )
  }
}

export default appWithTranslation(MyApp)
