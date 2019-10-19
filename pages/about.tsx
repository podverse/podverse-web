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
          <span className='font-bold'>Podverse makes it easy to create, share, and discover full-length clips from your favorite podcasts. </span>
          Other features include an intuitive design, sharable playlists, user profiles, a queue that syncs across all of your devices.
        </p>

        <p>
          All Podverse software is provided under an open source, copyleft license.
          You may download, modify, and use it for any purpose,
          as long as you share your changes to the code.
        </p>

        <p><a href='https://apps.apple.com/us/app/podverse/id1390888454'>Download from the App Store</a></p>

        <p><a href='https://play.google.com/store/apps/details?id=com.podverse&hl=en_US'>Download from the Play Store</a></p>

        <hr />

        <h3>Principles</h3>
        <p>Never sell or share private user data.</p>
        <p>Never add advertisements without podcaster permission.</p>
        <p>Allow users to download their complete data, so they can leave the site at any time.</p>
        <p>Build in accordance with <a href='https://humanetech.com/problem/'>humane technology</a> principles.</p>

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
