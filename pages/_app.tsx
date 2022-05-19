import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Script from 'next/script'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, NowPlayingItem } from 'podverse-shared'
import React, { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import { unstable_batchedUpdates } from 'react-dom'
import Modal from 'react-modal'
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
import { initialState } from '~/state/omniauralState'
import { playerLoadNowPlayingItem, saveCurrentPlaybackPositionToHistory } from '~/services/player/player'
import { getNowPlayingItemOnServer } from '~/services/userNowPlayingItem'
import { initializeMatomo, matomoTrackPageView } from '~/services/tracking'

// TODO: temporarily using require instead of require to work around a build error happening
// in the Github action pipeline: "'PlayerAudio' cannot be used as a JSX component."
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ToastProvider } = require('react-toast-notifications')

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
    converse: any
    mermaid: any
  }
  interface Date {
    addDays: any
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'webln-v4v': any
    }
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
  const doNotInheritAppComponent =
    router.pathname.startsWith('/miniplayer') ||
    router.pathname.startsWith('/videoplayer') ||
    router.pathname.startsWith('/chat')

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
    ;(async () => {
      if (!doNotInheritAppComponent) {
        const nowPlayingItem = await getNowPlayingItemOnServer()
        const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
        const { serverClip, serverEpisode } = pageProps
        const shouldPlay = false

        if (currentNowPlayingItem) {
          // do nothing
        } else if (nowPlayingItem) {
          unstable_batchedUpdates(() => {
            playerLoadNowPlayingItem(nowPlayingItem, shouldPlay)
          })
        } else if (serverClip) {
          const npi = convertToNowPlayingItem(serverClip)
          unstable_batchedUpdates(() => {
            playerLoadNowPlayingItem(npi, shouldPlay)
          })
        } else if (serverEpisode) {
          const npi = convertToNowPlayingItem(serverEpisode)
          unstable_batchedUpdates(() => {
            playerLoadNowPlayingItem(npi, shouldPlay)
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

  if (doNotInheritAppComponent) {
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
      <>
        <Script async id='webln-v4v' src='https://cdn.jsdelivr.net/npm/webln-v4v@1.0.0-beta.20/dist/webcomponent.js' />
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
      </>
    )
  }
}

export default appWithTranslation(MyApp)
