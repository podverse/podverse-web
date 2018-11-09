import React from 'react'
import App, { Container } from 'next/app'
import Meta from '~/components/meta'
import Footer from '~/components/Footer/Footer'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'

addFontAwesomeIcons()

declare global {
  interface Window { nowPlayingItem: NowPlayingItem }
}

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Meta />
        <div className='view'>
          <div className='view__top'>
            <Component {...pageProps} />
            <div className='max-width'>
              <Footer />
            </div>
          </div>
          <MediaPlayerView {...pageProps} />
        </div>
      </Container>
    )
  }
}
