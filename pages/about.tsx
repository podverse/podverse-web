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
            Create and share highlights of your favorite podcasts with Podverse!
            Now available on iOS, Android, and web.
            Sign up today and get 1 year of Podverse premium for free <span aria-label='partying face' role='img'>🥳</span>
          </p>
          <label>Free features:</label>
          <ul>
            <li>Subscribe to podcasts</li>
            <li>Download episodes</li>
            <li>Auto-download new episodes</li>
            <li>Create and share podcast clips of any length</li>
            <li>Add episodes and clips to a queue</li>
            <li>Light / Dark mode</li>
          </ul>
          <label>Premium features:</label>
          <ul>
            <li>Sync your subscriptions across all devices</li>
            <li>Sync your queue across all devices</li>
            <li>Create and share playlists</li>
            <li>Subscribe to playlists</li>
            <li>Share your user profile</li>
            <li>Subscribe to user profiles</li>
          </ul>
          <p>
            All Podverse software is provided under an open source, copyleft license.
            You may download, modify, and use it for any purpose,
            as long as you also share your changes to the code.
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
