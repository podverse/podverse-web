import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import OmniAural from "omniaural"
import React, { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import Modal from 'react-modal'
import { Modals, NavBar, HorizontalNavBar, Player, PageLoadingOverlay } from '~/components'
import "~/state"
import initialState from "~/state/initialState.json"

OmniAural.initGlobalState(initialState)

fontAwesomeConfig.autoAddCss = false

Modal.setAppElement('.app')

function MyApp({ Component, pageProps }) {
  const { serverUserInfo } = pageProps
  OmniAural.setUserInfo(serverUserInfo)
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
        <Player />
        <Modals />
        <PageLoadingOverlay />
      </div>
    </CookiesProvider>
  )
}

export default appWithTranslation(MyApp)
