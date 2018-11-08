import React from 'react'
import App, { Container } from 'next/app'
import Link from 'next/link'
import Meta from '~/components/meta'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView';
import { NowPlayingItem } from '~/lib/nowPlayingItem';

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
          </div>
          <MediaPlayerView {...pageProps} />
        </div>
      </Container>
    )
  }
}
