import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import App, { Container } from 'next/app'
import { getPriorityQueueItemsStorage } from 'podverse-ui'
import Meta from '~/components/meta'
import Auth from '~/components/Auth/Auth'
import Footer from '~/components/Footer/Footer'
import NavBar from '~/components/NavBar/NavBar'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { initializeStore } from '~/redux/store'
import { playerQueueLoadPriorityItems } from '~/redux/actions'
import { actionTypes } from '~/redux/constants'
const cookie = require('cookie')

addFontAwesomeIcons()

declare global {
  interface Window { nowPlayingItem: NowPlayingItem }
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
    login: {
      isOpen?: boolean
    }
  }
  playerQueue: {
    priorityItems: any[]
    secondaryItems: any[]
  }
  playerQueueLoadPriorityItems?: any
  store?: any
}

export default withRedux(initializeStore)(class MyApp extends App<Props> {
  
  static defaultProps: Props = {
    currentPage: {
      episode: null,
      listItems: [],
      mediaRef: null,
      nowPlayingItem: null,
      podcast: null
    },
    mediaPlayer: {
      nowPlayingItem: {}
    },
    modals: {
      login: {
        isOpen: false
      }
    },
    playerQueue: {
      priorityItems: [],
      secondaryItems: []
    }
  }
  
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (ctx.req.headers.cookie) {
      const parsedCookie = cookie.parse(ctx.req.headers.cookie)
      ctx.store.dispatch({
        type: actionTypes.USER_SET_IS_LOGGED_IN,
        payload: !!parsedCookie.Authentication
      })
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount() {
    const { store } = this.props
    const priorityItems = getPriorityQueueItemsStorage()
    store.dispatch(playerQueueLoadPriorityItems(priorityItems))
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
          </Fragment>
        </Provider>
      </Container>
    )
  }
}) 
