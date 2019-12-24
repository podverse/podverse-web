import React, { Component } from 'react'
import Head from 'next/head'
import '~/lib/constants/misc'
import '~/scss/styles.scss'
import config from '~/config'
const { metaDefaultImageUrl1200x630 } = config()
const striptags = require('striptags')

type Props = {
  description?: string
  iphoneCustomScheme?: string
  ogDescription?: string
  ogImage?: string
  ogImageAlt?: string
  ogTitle?: string
  ogType?: string
  ogUrl?: string
  robotsNoIndex?: boolean
  title?: string
  twitterDescription?: string
  twitterImage?: string
  twitterImageAlt?: string
  twitterTitle?: string
}

type State = {}

class Meta extends Component<Props, State> {

  render () {
    const { description = '', iphoneCustomScheme = '', ogDescription = '', ogImage = '', ogImageAlt = '',
      ogTitle = '', ogType = '', ogUrl = '', robotsNoIndex = '', title = '', twitterDescription = '', twitterImage = '',
      twitterImageAlt = '', twitterTitle = '' } = this.props
    
    const ogImg = !ogImage ? metaDefaultImageUrl1200x630 : ogImage
    const twitterImg = !twitterImage ? metaDefaultImageUrl1200x630 : twitterImage

    const strippedDescription = striptags(description)
    const strippedOgDescription = striptags(ogDescription)
    const strippedTwitterDescription = striptags(twitterDescription)

    return (
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='no-email-collection' content='http://www.unspam.com/noemailcollection/' />
        { robotsNoIndex && <meta name='robots' content='noindex' /> }
        
        {/* Favicons */}
        <link rel='apple-touch-icon' sizes='180x180' href='/images/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/images/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/images/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/images/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />

        <meta name='title' content={title} />
        <meta name='description' content={strippedDescription} />

        <meta name='apple-itunes-app' content='app-id=1390888454' />

        {/* Open Graph meta tags  */}
        <meta property='og:title' content={ogTitle} />
        <meta property='og:type' content={ogType} />
        <meta property='og:image' content={ogImg} />
        <meta property='og:image:alt' content={ogImageAlt || 'Podverse logo'} />
        <meta property='og:image:secure_url' content={ogImg} />
        <meta property='og:image:description' content={strippedOgDescription} />
        <meta property='og:site_name' content='Podverse' />
        <meta property='og:url' content={ogUrl} />
        <meta property='fb:app_id' content='300336890140007' />

        {/* Twitter global meta tags */}
        <meta name='twitter:site' content='@podverse' />
        <meta name='twitter:site:id' content='2555941009' />
        <meta name='twitter:creator' content='@podverse' />
        <meta name='twitter:creator:id' content='2555941009' />
        <meta name='twitter:app:name:iphone' content='Podverse' />
        <meta name='twitter:app:id:iphone' content='1390888454' />
        {
          iphoneCustomScheme &&
            <meta name='twitter:app:url:iphone' content={iphoneCustomScheme} />
        }
        {/* <meta name='twitter:app:name:ipad' content='Name of your iPad optimized app' /> 
        <meta name='twitter:app:id:ipad' content='Your app ID in the iTunes App Store' /> 
        <meta name='twitter:app:url:ipad' content='Your app’s custom URL scheme' /> 
        <meta name='twitter:app:name:googleplay' content='Name of your Android app' /> 
        <meta name='twitter:app:id:googleplay' content='Your app ID in the Google Play Store' /> 
        <meta name='twitter:app:url:googleplay' content='Your app’s custom URL scheme' />  */}

        {/* Twitter page-specific meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:description' content={strippedTwitterDescription} />
        <meta name='twitter:title' content={twitterTitle} />
        <meta name='twitter:image' content={twitterImg} />
        <meta name='twitter:image:alt' content={twitterImageAlt || 'Podverse logo'} />
      </Head>
    )
  }
}

export default Meta
