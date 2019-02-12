import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import App, { Container } from 'next/app'
import ReactGA from 'react-ga'
import { getNowPlayingOrNextFromStorage, getPriorityQueueItemsStorage,
  setNowPlayingItemInStorage } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import Alerts from '~/components/Alerts/Alerts'
import Auth from '~/components/Auth/Auth'
import Footer from '~/components/Footer/Footer'
import MediaModals from '~/components/MediaModals/MediaModals'
import NavBar from '~/components/NavBar/NavBar'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import PageLoadingOverlay from '~/components/PageLoadingOverlay/PageLoadingOverlay'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { initializeStore } from '~/redux/store'
import { mediaPlayerLoadNowPlayingItem, pageIsLoading,
    playerQueueLoadPriorityItems } from '~/redux/actions'
import { actionTypes } from '~/redux/constants'
import { getAuthenticatedUserInfo } from '~/services'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import config from '~/config'
const { googleAnalyticsConfig, paypalConfig } = config()
const cookie = require('cookie')

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
  page: {
    isLoading?: boolean
  },
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

      if (parsedCookie.nsfwModeHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_NSFW_MODE,
          payload: parsedCookie.nsfwModeHide
        })
      }

      if (parsedCookie.uiThemeHide) {
        ctx.store.dispatch({
          type: actionTypes.SETTINGS_SET_HIDE_UI_THEME,
          payload: parsedCookie.uiThemeHide
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

    const { newPlayingItem } = pageProps

    if (!process.browser && newPlayingItem) {
      ctx.store.dispatch(mediaPlayerLoadNowPlayingItem(newPlayingItem))
    }

    // @ts-ignore
    if (process.browser && ctx.query && ctx.query.scrollToTop) {
      scrollToTopOfView()
    }

    return { pageProps, cookies, newPlayingItem }
  }

  async componentDidMount() {
    const { newPlayingItem, store } = this.props
    const state = store.getState()
    const { user } = state

    if (!windowHasLoaded) {
      if (newPlayingItem) {
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
    const { Component, cookies, pageProps, store } = this.props

    return (
      <Container>
        <Provider store={store}>
          <Fragment>
            <Meta />
            <Auth />
            <PageLoadingOverlay />
            <div className='view'>
              <div className='view__navbar'>
                <NavBar />
              </div>
              <div className='view__contents'>
                <div className='max-width top'>
                  <Alerts cookies={cookies} />
                  <Component {...pageProps} />
                </div>
                <div className='max-width bottom'>
                  <Footer />
                </div>
              </div>
              <MediaPlayerView {...pageProps} />
            </div>
            <MediaModals />
          </Fragment>
        </Provider>
      </Container>
    )
  }
}) 
