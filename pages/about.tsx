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
      description: 'About Podverse - Create and share podcast highlights',
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
          Our goal is to create the world’s most artist and user friendly podcast technology.
          The primary features of Podverse are 1) the ability to create and share podcast clips, playlists,
          and user profiles, 2) an easy to manage player queue that syncs across all your devices,
          and 3) an intuitive and streamlined podcast listening experience.
        </p>

        <h3>Open Source</h3>
        <p>
          All Podverse software is provided under a copyleft license.
          Anyone can freely download the software and use it for any purpose,
          as long as they also share their changes to the code.
          Copyleft licenses can help prevent tech monopolies.
        </p>

        <hr />

        <h3>Principles</h3>
        <p>Never sell or share private user data.</p>
        <p>Never add advertisements without (podcaster permission).</p>
        <p>Allow users to download their complete data, so they can leave the site at any time.</p>

        <hr />

        <h3>Team</h3>
        <p>Mitch Downey – Programmer</p>
        <p>Creon Creonopoulos - Programmer</p>
        <p>Vincent Schramer – Programmer</p>
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
