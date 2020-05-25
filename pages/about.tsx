import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
const { BASE_URL } = config()

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
      currentUrl: BASE_URL + '/about',
      description: 'Information about the Podverse open source podcast app.',
      title: 'Podverse - About'
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
            Podverse is an open source podcast manager for Android, iOS, and web with cross-platform syncing,
            clip and playlist sharing, an intuitive interface, and more!
          </p>
          <label>Free features:</label>
          <ul>
            <li>Subscribe to podcasts</li>
            <li>Play clips and episodes</li>
            <li>Auto-download episodes</li>
            <li>Drag-and-drop queue</li>
            <li>Add podcasts by RSS</li>
            <li>Sleep timer</li>
            <li>Light / Dark mode </li>
          </ul>
          <label>Premium features:</label>
          <ul>
            <li>Create and share podcast highlights</li>
            <li>Switch devices and play from where you left off</li>
            <li>Sync your subscriptions across devices</li>
            <li>Sync your "added by RSS" podcasts across devices</li>
            <li>Sync your queue across devices</li>
            <li>Create and share playlists</li>
            <li>Subscribe to playlists</li>
            <li>Share your user profile</li>
            <li>Subscribe to user profiles</li>
          </ul>
          <p>
            Our mission is to support the original independent spirit
            of podcasting. We would love to collaborate with any and all podcast apps
            to make our technologies as cross-compatible, convenient,
            and empowering for people as possible.
          </p>
          <p>
            All Podverse software is provided free and open source (FOSS),
            but features that require updating our servers
            are available only with a Premium membership.
            Sign up today and get 1 year of Premium for free <span role='img' aria-label='partying face emoji'>🥳</span>
          </p>
          <p>
            If you have any questions or would be interested in collaborating
            please email <a href="mailto:contact@podverse.fm">contact@podverse.fm</a>
            or reach us through one of our social media channels.
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
