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
      description: 'Information about Podverse, our people, and our technology.',
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

        <h4>Features</h4>
        <ul style={{ listStyle: 'disc', marginLeft: '1.125rem' }}>
          <li style={{ marginBottom: '0.125rem' }}>Subscribe to podcasts</li>
          <li style={{ marginBottom: '0.125rem' }}>Create and share highlights</li>
          <li style={{ marginBottom: '0.125rem' }}>Create and share playlists</li>
          <li style={{ marginBottom: '0.125rem' }}>Sync your queue across all devices</li>
          <li style={{ marginBottom: '0.125rem' }}>Navigate the site without stopping audio</li>
          <li style={{ marginBottom: '0.125rem' }}>Share your user profile</li>
          <li style={{ marginBottom: '0.125rem' }}>SFW / NSFW mode</li>
          <li style={{ marginBottom: '0.125rem' }}>Light / Dark mode</li>
        </ul>

        <hr />

        <h4>Open Source</h4>
        <p>
          All Podverse software is provided under a copyleft license.
          Anyone can freely download the software and use it for any purpose,
          as long as they share their changes to the code.
        </p>
        <p>
          Copyleft licenses are essential to preventing tech monopolies because
          they are the only way to guarantee software is and will always remain free.
        </p>

        <hr />

        <h4>Our Ethics</h4>
        <p>We will never sell or share private user data.</p>
        <p>We will never add advertisements without a podcaster's permission.</p>
        <p>We will never lock your data into our service. You can download a copy of all your account's data at any time.</p>

        <hr />

        <h4>Why charge for premium memberships?</h4>
        <p>
          While all Podverse software is free and open source, premium memberships cost $5 a year.
          Our goal is not to make as much money as possible, but to make just enough so we can dedicate ourselves
          full-time to the project while covering necessary business expenses.
        </p>
        <p>
          Furthermore, premium memberships help ensure that we always put the interests of our users first.
          Many sites that claim to be "free" actually cost a great deal in terms of violations of our privacy,
          manipulation of public opinion, and disrespect of our well-being by promoting addictive behaviors.
        </p>
        <p>
          "Free" websites engage in these practices because they care more about advertisers than users,
          but subscription-based models can help tech companies avoid this trap.
        </p>
        
        <hr />

        <h3>Team</h3>
        <p>Creon Creonopoulos - Programmer</p>
        <p>Mitch Downey – Programmer</p>
        <p>Gary Johnson – UX Designer</p>
        <p>Vincent Schramer – Programmer</p>

      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(About)
