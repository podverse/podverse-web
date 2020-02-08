import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'

type Props = {
  lastScrollPosition?: number
  meta?: any
  pageKey?: string
}

type State = {}

const kPageKey = 'about'

class About extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'About Podverse - Create podcast highlights',
      title: 'About'
    }

    return { lastScrollPosition, meta, pageKey: kPageKey }
  }

  render() {
    const { meta } = this.props

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />

        <h3>About</h3>
        <div className='about'>
          <p>
            Podverse is the easiest way to create and share podcast highlights of any length online.
            Discover new podcasts by browsing highlights in the app, and send highlights to your friends to introduce
            them to your favorite shows. No login necessary!
          </p>
          <p>
            Podverse is also a fully functional podcast app for iOS, Android, and web,
            designed to sync across all of your devices.
            Sign up today for a 1 year free trial of Podverse premium <span aria-label='partying face' role='img'>🥳</span>
          </p>
          <label>Free features:</label>
          <ul>
            <li>Play episodes and clips</li>
            <li>Subscribe to podcasts</li>
            <li>Download episodes</li>
            <li>Auto-download new episodes</li>
            <li>Create and share podcast clips of any length</li>
            <li>Add episodes and clips to a queue</li>
            <li>Light / Dark mode</li>
          </ul>
          <label>Premium features:</label>
          <ul>
            <li>Switch devices and play from where you left off</li>
            <li>Sync your subscriptions across all devices</li>
            <li>Sync your queue across all devices</li>
            <li>Create and share playlists</li>
            <li>Subscribe to playlists</li>
            <li>Share your user profile</li>
            <li>Subscribe to user profiles</li>
          </ul>
          <p>
            All Podverse software is provided under an open source, copyleft license.
            Anyone can download, modify, and use Podverse software for any purpose for free,
            as long as they also share their changes to the code.
            In other words, a podcast network can launch their own podcast app for free with Podverse software.
          </p>
          <p>
            Thanks for checking out the site!
            Any questions, feedback, or feature requests would be greatly appreciated.
          </p>
        </div>

        <div className='flex-row'>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a
            className="download-on-the-app-store"
            href="https://apps.apple.com/us/app/podverse/id1390888454?mt=8"
          />
          <a
            className="get-it-on-google-play"
            href='https://play.google.com/store/apps/details?id=com.podverse&hl=en_US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
            <img
              alt='Get it on Google Play'
              src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'
            />
          </a>
        </div>

        <hr />

        <h3>Team</h3>
        <p>Mitch Downey – Programmer</p>
        <p>Creon Creonopoulos - Programmer</p>
        <p>Gary Johnson – Designer</p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(About)
