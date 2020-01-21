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
        <p>
          <span className='font-bold'>Podverse is a multi-platform podcast app with unlimited clip sharing and more <span aria-label='Partying emoji' role='img'>🥳</span></span>
          Other features include an intuitive design, sharable playlists, sharable user profiles, and the ability to sync your subscriptions and queue across all of your devices.
        </p>

        <p>
          All Podverse software is provided under an open source, copyleft license.
          You may download, modify, and use it for any purpose,
          as long as you share your changes to the code.
        </p>

        <p>
          Sign up today and get 1 year of Podverse Premium for free!
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
