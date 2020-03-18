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
            Podverse is the easiest way to create and share podcast highlights online,
            and the only podcast app you'll ever need.
            Sign up today for 1 year of premium for free! <span role='img' aria-label='partying face emoji'>🥳</span>
          </p>
          <label>Free version:</label>
          <ul>
            <li>Create and share podcast highlights</li>
            <li>Subscribe to podcasts</li>
            <li>Download episodes</li>
            <li>Drag-and-drop player queue</li>
            <li>Sleep Timer</li>
            <li>Support for devices with large fonts</li>
            <li>Light / Dark mode</li>
          </ul>
          <label>Premium version:</label>
          <ul>
            <li>Sync your subscriptions across devices</li>
            <li>Sync your queue across devices</li>
            <li>Switch devices and play from where you left off</li>
            <li>Create and share playlists</li>
            <li>Subscribe to playlists</li>
            <li>Share your user profile</li>
            <li>Subscribe to user profiles</li>
          </ul>
          <p>
            All Podverse software is provided free and open source under the AGPLv3 license.
            We will never sell your data or add advertisements to podcaster content.
          </p>
          <p>
            Any questions or feedback would be appreciated. Thank you!
          </p>
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
