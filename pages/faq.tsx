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
      description: 'Podverse frequently asked questions',
      title: 'FAQ'
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
        <p><a href='https://goo.gl/forms/VGVJRWlKPIGRqojY2' target='_blank'>Ask a question</a></p>
        <h3>Table of Contents</h3>
        <ul>
          <li>
            <a href='#agplv3'>What does AGPLv3 mean?</a>
          </li>
          <li>
            <a href='#monopoly-proof'>How is Podverse monopoly-proof?</a>
          </li>
        </ul>
        <hr />
        <h3 id='agplv3'>What does AGPLv3 mean?</h3>
        <p>
          <a href='https://www.gnu.org/licenses/agpl-3.0.en.html' target='_blank'>AGPLv3</a> is the open source license under which all Podverse technolgy is provided.
        </p>
        <hr />
        <h3 id='monopoly-proof'>How is Podverse monopoly-proof?</h3>
        <p>
          Podverse software is distributed under the AGPLv3 open source license, which allows anyone to freely use, modify, and distribute the software, as long as they share their modifications as well. The share-alike requirement of the AGPLv3 ensures that the code is and will always remain free.
        </p>
        <p>
          Also, to prevent data lock-in, future releases of Podverse will be built in accordance with podcast open data standards, so that all Podverse data will be easily compatible with any app that follows those same data standards. The benefit of this is, if you wanted to stop using Podverse and use a different podcast app instead, you could download all your Podverse data and transfer it into the competitor's app, and get up and running without losing anything in the process. Even further than that, you could use multiple different podcast apps, but share data between all of them, so they are always in sync with one another.
        </p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FAQ)
