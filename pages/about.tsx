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

        <h3>Features</h3>
        <ul style={{ listStyle: 'disc', marginLeft: '1.125rem' }}>
          <li style={{ marginBottom: '0.125rem' }}>Subscribe to podcasts</li>
          <li style={{ marginBottom: '0.125rem' }}>Create and share highlights</li>
          <li style={{ marginBottom: '0.125rem' }}>Create and share playlists</li>
          <li style={{ marginBottom: '0.125rem' }}>Sync your queue on all devices</li>
          <li style={{ marginBottom: '0.125rem' }}>Drag and drop queue ordering</li>
          <li style={{ marginBottom: '0.125rem' }}>Navigate the site without stopping audio</li>
          <li style={{ marginBottom: '0.125rem' }}>Share your user profile</li>
          <li style={{ marginBottom: '0.125rem' }}>SFW / NSFW mode</li>
          <li style={{ marginBottom: '0.125rem' }}>Light / Dark mode</li>
        </ul>

        <hr />

        <h3>Open Source</h3>
        <p>
          All Podverse software is provided under a copyleft license.
          Anyone can freely download the software and use it for any purpose,
          as long as they also share their changes to the code.
        </p>
        <p>
          Copyleft licenses are necessary for preventing tech monopolies because
          they are the only way to guarantee software is and will always remain free.
        </p>

        <hr />

        <h3>Principles</h3>
        <p>Never sell or share your private data.</p>
        <p>Never add advertisements without a podcaster's permission.</p>
        <p>Never lock you into our service. You can download a copy of all your data and leave the site at any time.</p>

        {/* <hr /> */}

        {/* <h3>Why charge for premium memberships?</h3>
        <p>
          While all Podverse software is free and open source, premium memberships cost $5 a year.
          That's because although you have the freedom to download, use, and modify the software
          however you like, it still costs us time and money to keep the servers running, so we
          need to charge something to keep the project sustainable.
        </p> */}
        {/* <p>
          Many apps that claim to be "free" actually cost us a great deal through violations of our privacy,
          manipulation of public opinion, and disrespect for our health by promoting addictive
          behaviors. This happens because so-called "free" apps tend to have to make their money
          from advertisements and selling your data, so they care more about advertisers and large corporations
          than their acutal users. A subscription-based premium model gives us more incentive to honestly
          serve the best interests of our users.
        </p> */}

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
