import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import App, { Container } from 'next/app'
import ReactGA from 'react-ga'
import { getNowPlayingOrNextFromStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage } from 'podverse-ui'
import Alerts from '~/components/Alerts/Alerts'
import Auth from '~/components/Auth/Auth'
import Footer from '~/components/Footer/Footer'
import MediaModals from '~/components/MediaModals/MediaModals'
import NavBar from '~/components/NavBar/NavBar'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import PageLoadingOverlay from '~/components/PageLoadingOverlay/PageLoadingOverlay'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { assignLocalOrLoggedInNowPlayingItemPlaybackPosition } from '~/lib/utility'
import { disableHoverOnTouchDevices } from '~/lib/utility/disableHoverOnTouchDevices'
import { fixMobileViewportHeight } from '~/lib/utility/fixMobileViewportHeight'
import { initializeStore } from '~/redux/store'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading,
    playerQueueLoadPriorityItems } from '~/redux/actions'
import { actionTypes } from '~/redux/constants'
import { getAuthenticatedUserInfo } from '~/services'
import config from '~/config'
const { googleAnalyticsConfig } = config()
const cookie = require('cookie')
const MobileDetect = require('mobile-detect')

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
    let pageProps = {}

    ctx.store.dispatch(pageIsLoading(true))

    let cookies = {}

    if (!process.browser && ctx.query && ctx.query.forgotPassword) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_FORGOT_PASSWORD_SHOW,
        payload: ctx.query.forgotPassword
      })
    } else if (!process.browser && ctx.query && ctx.query.resetPassword) {
      ctx.store.dispatch({
        type: actionTypes.MODALS_RESET_PASSWORD_SHOW,
        payload: ctx.query.resetPassword
      })
    }

    let isMobileDevice = false
    if (typeof window === 'object') {
      const md = new MobileDetect(window.navigator.userAgent)
      isMobileDevice = !!md.mobile()
    } else {
      const md = new MobileDetect(ctx.req.headers['user-agent'])
      isMobileDevice = !!md.mobile()
    }


    // @ts-ignore
    if (!process.browser && ctx.req.headers.cookie) {
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
      } else if (isMobileDevice) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_TIME_JUMP_BACKWARD_BUTTON,
          payload: 'false'
        })
      } else {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_TIME_JUMP_BACKWARD_BUTTON,
          payload: 'true'
        })
      }

      if (parsedCookie.playbackSpeedButtonHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_PLAYBACK_SPEED_BUTTON,
          payload: parsedCookie.playbackSpeedButtonHide
        })
      } else if (isMobileDevice) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_PLAYBACK_SPEED_BUTTON,
          payload: true
        })
      }

      if (parsedCookie.Authorization) {
        try {
          const userInfo = await getAuthenticatedUserInfo(parsedCookie.Authorization)

          if (userInfo && userInfo.data) {
            ctx.bearerToken = parsedCookie.Authorization

            ctx.store.dispatch({
              type: actionTypes.USER_SET_INFO,
              payload: {
                email: userInfo.data.email,
                freeTrialExpiration: userInfo.data.freeTrialExpiration,
                historyItems: userInfo.data.historyItems,
                id: userInfo.data.id,
                isPublic: userInfo.data.isPublic,
                mediaRefs: userInfo.data.mediaRefs,
                membershipExpiration: userInfo.data.membershipExpiration,
                name: userInfo.data.name,
                playlists: userInfo.data.playlists,
                queueItems: userInfo.data.queueItems,
                subscribedPlaylistIds: userInfo.data.subscribedPlaylistIds,
                subscribedPodcastIds: userInfo.data.subscribedPodcastIds,
                subscribedUserIds: userInfo.data.subscribedUserIds
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

    if (typeof(window) === 'object') {
      ReactGA.pageview(ctx.asPath)
    }

    const { lastScrollPosition, newPlayingItem } = pageProps

    if (!process.browser && newPlayingItem) {
      ctx.store.dispatch(mediaPlayerLoadNowPlayingItem(newPlayingItem))
    }

    if (process.browser && lastScrollPosition) {
      setTimeout(() => {
        document.querySelector('.view__contents').scrollTop = lastScrollPosition
      }, 0)
    } else if (process.browser) {
      scrollToTopOfView()
    }

    return { pageProps, cookies, isMobileDevice, newPlayingItem }
  }

  async componentDidMount() {
    let { newPlayingItem } = this.props
    const { store } = this.props
    const state = store.getState()
    const { user } = state

    if (!windowHasLoaded) {
      disableHoverOnTouchDevices()
      fixMobileViewportHeight()

      if (newPlayingItem) {
        newPlayingItem = assignLocalOrLoggedInNowPlayingItemPlaybackPosition(user, newPlayingItem)
        store.dispatch(mediaPlayerLoadNowPlayingItem(newPlayingItem))
        setNowPlayingItemInStorage(newPlayingItem)
      } else {
        const currentItem = getNowPlayingOrNextFromStorage()
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
  }

  render() {
    const { Component, cookies, isMobileDevice, pageProps, store } = this.props
    const { pageKey } = pageProps

    return (
      <Container>
        <Provider store={store}>
          <Fragment>
            <Auth />
            <PageLoadingOverlay />
            <div className='view'>
              <div className='view__navbar'>
                <NavBar pageKey={pageKey} />
              </div>
              <div className='view__contents'>
                <div className='max-width top'>
                  <Alerts
                    cookies={cookies}
                    pageKey={pageKey} />
                  <Component {...pageProps} />
                </div>
                <div className='max-width bottom'>
                  <Footer pageKey={pageKey} />
                </div>
              </div>
              <MediaPlayerView
                {...pageProps}
                isMobileDevice={isMobileDevice} />
            </div>
            <MediaModals />
          </Fragment>
        </Provider>
      </Container>
    )
  }
}) 
