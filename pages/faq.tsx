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

const kPageKey = 'faq'

class FAQ extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Podverse - Frequently asked questions',
      title: 'Podverse - FAQ'
    }

    return { lastScrollPosition, pageKey: kPageKey, meta }
  }

  render () {
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
        <h3>FAQ</h3>

        <p><a href='https://goo.gl/forms/VGVJRWlKPIGRqojY2' target='_blank' rel="noopener noreferrer">Ask a question</a></p>
        
        <h3>Table of Contents</h3>

        <ul>
          <li>
            <a href='#why-clip-time'>Why is my clip's start and end time not staying accurate?</a>
          </li>
          <li>
            <a href='#what-does-open-source-mean'>What does open source mean?</a>
          </li>
          <li>
            <a href='#why-is-podverse-open-source'>Why is Podverse open source?</a>
          </li>
        </ul>
        
        <hr />

        <h4 id='why-clip-time'>Why is my clip's start and end time not staying accurate?</h4>

        <p>
          This is an issue that affects some, but not all podcasts on Podverse.
          The most common reason is dynamic ad insertion.
          Podcasts that use dynamic ads rotate different ads in for different listeners of the same episode.
          Since we can't predict which ads each listener will get,
          we can't predict exactly when a clip is supposed to start or how long they are,
          the result is their clips may have a start and end time that is off by seconds or minutes.
        </p>
        <p>
          We would love to resolve this limitation some day, and we can,
          but we'll need to collaborate with podcast hosting services and their ad networks to do so.
          In the meantime, Podverse clips should work reliably for the vast majority of
          podcasts that do not use dynamic ad insertion.
        </p>

        <h4 id='what-does-open-source-mean'>What does AGPLv3 / open source mean?</h4>

        <p>
          AGPLv3 is the open source license under which all Podverse software is provided.
          It says that anyone can download, modify, and use this software for any purposes for free,
          as long as they also share their changes to the code.
        </p>

        <h4 id='why-is-podverse-open-source'>Why is Podverse open source?</h4>

        <p>
          Podverse's goal is to help podcasting stay beyond the reach of monopolies and corporate gatekeepers.
          We open source Podverse software to ensure that anyone can launch their own
          podcast app as affordably as possible. If a podcast network wants to create their
          own podcast app, they can use Podverse software and do it for a tiny fraction of what it would cost
          to hire programmers to build an app from scratch.
        </p>

        <hr />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FAQ)
