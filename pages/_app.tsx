import React from 'react'
import App, { Container } from 'next/app'
import { Navbar } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Meta from '~/components/meta'
import Footer from '~/components/Footer/Footer'
import MediaPlayerView from '~/components/MediaPlayerView/MediaPlayerView'
import { addFontAwesomeIcons } from '~/lib/fontAwesomeIcons'
import { NowPlayingItem } from '~/lib/nowPlayingItem'


addFontAwesomeIcons()

declare global {
  interface Window { nowPlayingItem: NowPlayingItem }
}

const dropdownItems = [
  { 
    as: '/settings',
    href: '/settings',
    label: 'Settings' 
  },
  { 
    href: '#',
    label: 'Log out'
  }
]

const navItems = [
  { 
    as: '/search',
    href: '/search',
    icon: 'search'
  },
  {
    as: '/podcasts',
    href: '/podcasts',
    label: 'Podcasts'
  },
  { 
    as: '/playlists',
    href: '/playlists',
    label: 'Playlists'
  }
]

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

    const dropdownText = (<FontAwesomeIcon icon='user-circle'></FontAwesomeIcon>)

    return (
      <Container>
        <Meta />
        <div className='view'>
          <div className='view__navbar'>
            <Navbar
              brandText='Podverse'
              brandUrl='/'
              dropdownItems={dropdownItems}
              dropdownText={dropdownText}
              navItems={navItems} />
          </div>
          <div className='view__contents'>
            <div className='max-width'>
              <Component {...pageProps} />
              <Footer />
            </div>
          </div>
          <MediaPlayerView {...pageProps} />
        </div>
      </Container>
    )
  }
}
