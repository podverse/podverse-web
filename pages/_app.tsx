import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import App, { Container } from 'next/app'
import { getPriorityQueueItemsStorage } from 'podverse-ui'
import Meta from '~/components/meta'
import Auth from '~/components/Auth/Auth'
import Footer from '~/components/Footer/Footer'
import MediaModals from '~/components/MediaModals/MediaModals'
import NavBar from '~/components/NavBar/NavBar'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { initializeStore } from '~/redux/store'
import { playerQueueLoadPriorityItems } from '~/redux/actions'
import { actionTypes } from '~/redux/constants'
import { getAuthenticatedUserInfo } from '~/services';
import { scrollToTopOfView } from '~/lib/scrollToTop';
const cookie = require('cookie')

addFontAwesomeIcons()

declare global {
  interface Window { 
    nowPlayingItem: NowPlayingItem
    player: any
  }
}

type Props = {
  currentPage: {
    episode: any
    listItems: any[]
    mediaRef: any
    nowPlayingItem: any
    podcast: any
  }
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
  playerQueue: {
    priorityItems: any[]
    secondaryItems: any[]
  }
  playerQueueLoadPriorityItems?: any
  store?: any
}

export default withRedux(initializeStore)(class MyApp extends App<Props> {
    
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    // @ts-ignore
    if (!process.browser && ctx.req.headers.cookie) {
      const parsedCookie = cookie.parse(ctx.req.headers.cookie)

      if (parsedCookie.Authorization) {
        try {
          const userInfo = await getAuthenticatedUserInfo(parsedCookie.Authorization)

          if (userInfo && userInfo.data) {
            ctx.store.dispatch({
              type: actionTypes.USER_SET_INFO,
              payload: {
                historyItems: userInfo.data.historyItems,
                id: userInfo.data.id,
                playlists: userInfo.data.playlists,
                queueItems: userInfo.data.queueItems,
                subscribedPodcastIds: userInfo.data.subscribedPodcastIds
              }
            })
          }
        } catch (error) {
          // continue with unauthenticated user
        }
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // @ts-ignore
    if (process.browser && ctx.query && ctx.query.scrollToTop) {
      scrollToTopOfView()
    }

    return { pageProps }
  }

  async componentDidMount() {
    const { store } = this.props
    const state = store.getState()
    const { user } = state
  
    if (user && user.queueItems) {
      store.dispatch(playerQueueLoadPriorityItems(user.queueItems))
    } else {
      const priorityItems = getPriorityQueueItemsStorage()
      store.dispatch(playerQueueLoadPriorityItems(priorityItems))
    }
  }

  render() {
    const { Component, pageProps, store } = this.props

    return (
      <Container>
        <Provider store={store}>
          <Fragment>
            <Meta />
            <Auth />
            <div className='view'>
              <div className='view__navbar'>
                <NavBar />
              </div>
              <div className='view__contents'>
                <div className='max-width'>
                  <Component {...pageProps} />
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
