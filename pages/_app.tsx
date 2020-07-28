import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import ReactGA from 'react-ga'
import {
  getLastHistoryItemOrNowPlayingItemFromStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage
} from 'podverse-ui'
import Alerts from '~/components/Alerts/Alerts'
import AppLinkWidget from '~/components/AppLinkWidget/AppLinkWidget'
import Auth from '~/components/Auth/Auth'
import Footer from '~/components/Footer/Footer'
import MediaModals from '~/components/MediaModals/MediaModals'
import NavBar from '~/components/NavBar/NavBar'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import PageLoadingOverlay from '~/components/PageLoadingOverlay/PageLoadingOverlay'
import PV from '~/lib/constants'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { assignLocalOrLoggedInNowPlayingItemPlaybackPosition, checkIfLoadingOnFrontEnd } from '~/lib/utility'
import { disableHoverOnTouchDevices } from '~/lib/utility/disableHoverOnTouchDevices'
import { fixMobileViewportHeight } from '~/lib/utility/fixMobileViewportHeight'
import { initializeStore } from '~/redux/store'
import {
  mediaPlayerLoadNowPlayingItem, pageIsLoading,
  playerQueueLoadPriorityItems
} from '~/redux/actions'
import { actionTypes } from '~/redux/constants'
import { getAuthenticatedUserInfo } from '~/services'
import config from '~/config'
const { googleAnalyticsConfig } = config()
const cookie = require('cookie')
const MobileDetect = require('mobile-detect')

// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
fontAwesomeConfig.autoAddCss = false

addFontAwesomeIcons()

let windowHasLoaded = false

declare global {
  interface Window {
    nowPlayingItem: NowPlayingItem
    player: any
  }
}

type Props = {
  cookies: any
  isMobileDevice: boolean
  mediaPlayer: {
    nowPlayingItem: any
    playing?: boolean
  }
  modals: {
    addTo: {},
    clipCreated: {},
    forgotPassword: {},
    login: {},
    makeClip: {},
    queue: {},
    share: {},
    signUp: {}
  }
  newPlayingItem: any
  page: {
    isLoading?: boolean
  }
  pages: {},
  playerQueue: {
    priorityItems: any[]
    secondaryItems: any[]
  }
  playerQueueLoadPriorityItems?: any
  settings: {
    nsfwMode: boolean
    uiTheme: string
  }
  store?: any,
  user: {
    email: string
    emailVerified?: boolean
    freeTrialExpiration: any
    historyItems: any[]
    id: string
    isPublic: boolean
    mediaRefs: any[]
    membershipExpiration: any
    name: string
    playlists: any[]
    queueItems: any[]
    subscribedPlaylistIds: any[]
    subscribedPodcastIds: any[]
    subscribedUserIds: any[]
  }
}

export default withRedux(initializeStore)(class MyApp extends App<Props> {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} as any

    ctx.store.dispatch(pageIsLoading(true))

    let cookies = {}

    if (!checkIfLoadingOnFrontEnd() && ctx.query && ctx.query.login) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_LOGIN_SHOW,
        payload: true
      })
    } else if (!checkIfLoadingOnFrontEnd() && ctx.query && ctx.query.forgotPassword) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_FORGOT_PASSWORD_SHOW,
        payload: true
      })
    } else if (!checkIfLoadingOnFrontEnd() && ctx.query && ctx.query.resetPassword) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_RESET_PASSWORD_SHOW,
        payload: true
      })
    } else if (!checkIfLoadingOnFrontEnd() && ctx.query && ctx.query.sendVerificationEmail) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_SEND_VERIFICATION_EMAIL_SHOW,
        payload: true
      })
    }

    let isMobileDevice = null as boolean | null
    if (typeof window === 'object') {
      const md = new MobileDetect(window.navigator.userAgent)
      isMobileDevice = !!md.mobile()
    } else {
      const md = new MobileDetect(ctx.req.headers['user-agent'])
      isMobileDevice = !!md.mobile()
    }

    if (!checkIfLoadingOnFrontEnd() && ctx.req.headers.cookie) {
      const parsedCookie = cookie.parse(ctx.req.headers.cookie)

      if (parsedCookie.uiTheme) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_UI_THEME,
          payload: parsedCookie.uiTheme
        })
      }

      if (parsedCookie.nsfwMode) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_NSFW_MODE,
          payload: parsedCookie.nsfwMode
        })
      }

      if (parsedCookie.uiThemeHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_UI_THEME,
          payload: parsedCookie.uiThemeHide
        })
      }

      if (parsedCookie.nsfwModeHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_NSFW_MODE,
          payload: parsedCookie.nsfwModeHide
        })
      }

      if (parsedCookie.censorNSFWText) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_CENSOR_NSFW_TEXT,
          payload: parsedCookie.censorNSFWText
        })
      }

      if (parsedCookie.nsfwLabelsHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_NSFW_LABELS,
          payload: parsedCookie.nsfwLabelsHide
        })
      } else {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_NSFW_LABELS,
          payload: 'true'
        })
      }

      if (parsedCookie.filterButtonHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_FILTER_BUTTON,
          payload: parsedCookie.filterButtonHide
        })
      }

      if (parsedCookie.timeJumpBackwardButtonHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_TIME_JUMP_BACKWARD_BUTTON,
          payload: parsedCookie.timeJumpBackwardButtonHide
        })
      }

      if (parsedCookie.playbackSpeedButtonHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_PLAYBACK_SPEED_BUTTON,
          payload: parsedCookie.playbackSpeedButtonHide
        })
      }

      if (parsedCookie.Authorization) {
        try {
          const userInfo = await getAuthenticatedUserInfo(parsedCookie.Authorization)

          if (userInfo) {
            ctx.bearerToken = parsedCookie.Authorization

            ctx.store.dispatch({
              type: actionTypes.USER_SET_INFO,
              payload: {
                email: userInfo.email,
                emailVerified: userInfo.emailVerified,
                freeTrialExpiration: userInfo.freeTrialExpiration,
                historyItems: userInfo.historyItems,
                id: userInfo.id,
                isPublic: userInfo.isPublic,
                mediaRefs: userInfo.mediaRefs,
                membershipExpiration: userInfo.membershipExpiration,
                name: userInfo.name,
                playlists: userInfo.playlists,
                queueItems: userInfo.queueItems,
                subscribedPlaylistIds: userInfo.subscribedPlaylistIds,
                subscribedPodcastIds: userInfo.subscribedPodcastIds,
                subscribedUserIds: userInfo.subscribedUserIds
              }
            })
          }
        } catch (error) {
          // continue with unauthenticated user
        }
      }

      cookies = {
        showFreeTrialHasEnded: parsedCookie.showFreeTrialHasEnded,
        showFreeTrialWarning: parsedCookie.showFreeTrialWarning,
        showMembershipHasEnded: parsedCookie.showMembershipHasEnded,
        showMembershipWarning: parsedCookie.showMembershipWarning
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (typeof (window) === 'object') {
      ReactGA.pageview(ctx.asPath)
    }

    const { lastScrollPosition, newPlayingItem } = pageProps

    if (!checkIfLoadingOnFrontEnd() && newPlayingItem) {
      ctx.store.dispatch(mediaPlayerLoadNowPlayingItem(newPlayingItem))
    }

    if (checkIfLoadingOnFrontEnd() && lastScrollPosition) {
      setTimeout(() => {
        const el = document.querySelector('.view__contents')
        if (el) {
          el.scrollTop = lastScrollPosition
        }
      }, 0)
    } else if (checkIfLoadingOnFrontEnd()) {
      scrollToTopOfView()
    }

    return { pageProps, cookies, isMobileDevice, newPlayingItem }
  }

  async componentDidMount() {
    let { newPlayingItem } = this.props
    const { store } = this.props
    const state = store.getState()
    const { user } = state

    // If page uses a query parameter to show a modal on page load,
    // then update history so the query parameter version is not last in history.
    const urlParams = new URLSearchParams(window.location.search)
    const paramLogin = urlParams.get(PV.core.login)
    const paramForgotPassword = urlParams.get(PV.core.forgotPassword)
    const paramResetPassword = urlParams.get(PV.core.resetPassword)
    const paramSendVerificationEmail = urlParams.get(PV.core.sendVerificationEmail)
    if (paramLogin || paramForgotPassword || paramResetPassword || paramSendVerificationEmail) {
      window.history.pushState({}, document.title, window.location.origin + window.location.pathname)
    }

    const isiOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
    if (isiOSWebView) {
      const view = document.querySelector('.view')
      if (view) {
        view.className = 'view ios-webview-polyfill'
      }
    }

    if (!windowHasLoaded) {
      disableHoverOnTouchDevices()

      let fixMobileViewportHeightCount = 0
      const fixMobileViewportHeightInterval = setInterval(() => {
        fixMobileViewportHeight()
        fixMobileViewportHeightCount++
        if (fixMobileViewportHeightCount >= 5) {
          clearInterval(fixMobileViewportHeightInterval)
        }
      }, 2000)

      if (newPlayingItem) {
        newPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, newPlayingItem)
        store.dispatch(mediaPlayerLoadNowPlayingItem(newPlayingItem))
        setNowPlayingItemInStorage(newPlayingItem)
      } else {
        const currentItem = getLastHistoryItemOrNowPlayingItemFromStorage(user && user.historyItems)
        if (currentItem) store.dispatch(mediaPlayerLoadNowPlayingItem(currentItem))
      }
    }

    if (user && user.queueItems) {
      store.dispatch(playerQueueLoadPriorityItems(user.queueItems))
    } else {
      const priorityItems = getPriorityQueueItemsStorage()
      store.dispatch(playerQueueLoadPriorityItems(priorityItems))
    }

    ReactGA.initialize(googleAnalyticsConfig.trackingId)
    ReactGA.pageview(window.location.pathname + window.location.search)

    windowHasLoaded = true

    this.forceUpdate()
  }

  render() {
    const { Component, cookies, isMobileDevice, pageProps, store } = this.props
    const { pageKey } = pageProps

    const shouldHidePageContents = isMobileDevice === null

    return (
      <Provider store={store}>
        <Fragment>
          <Fragment>
            <PageLoadingOverlay />
            <div className='view'>
              <div className='view__navbar'>
                <NavBar pageKey={pageKey} />
              </div>
              <div className={`view__contents ${shouldHidePageContents ? 'hide' : ''}`}>
                <AppLinkWidget pageKey={pageKey} />
                <div className='max-width top'>
                  <Alerts
                    cookies={cookies}
                    pageKey={pageKey} />
                  <Component {...pageProps} />
                </div>
                <div className='max-width bottom'>
                  <Footer
                    isMobileDevice={isMobileDevice}
                    pageKey={pageKey} />
                </div>
              </div>
              <MediaPlayerView
                {...pageProps}
                isMobileDevice={isMobileDevice} />
            </div>
            <Auth />
            <MediaModals />
          </Fragment>
        </Fragment>
      </Provider>
    )
  }
}) 
