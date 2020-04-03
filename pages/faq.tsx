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

        <p><a href='https://goo.gl/forms/VGVJRWlKPIGRqojY2' target='_blank' rel="noopener noreferrer">Contact Us / Ask a question</a></p>
        
        <h3>Table of Contents</h3>

        <ul>
          <li>
            <a href='#dyanmic-ads'>Dynamic ads: Why do some clips start at the wrong time?</a>
          </li>
          <li>
            <a href='#what-does-open-source-mean'>What does open source mean?</a>
          </li>
          <li>
            <a href='#why-is-podverse-open-source'>Why is Podverse open source?</a>
          </li>
        </ul>
        
        <hr />

        <h4
          className='offset-anchor-tag'
          id='dyanmic-ads'>
          Dynamic ads: Why do some clips start at the wrong time?
        </h4>

        <p>
          Podverse clips should work reliably for the majority of
          podcasts that do not use dynamic ads, but the start times of clips from shows
          that use dynamic ads will not stay accurate.
        </p>
        <p>
          Podcasts that use dyanmic ads rotate different ads into the same episode.
          Since we can't predict which ads each listener will get or how long they will be,
          we can't determine the correct clip start time for all listeners.
        </p>
        <p>
          We would love to add full support for podcasts that use dynamic ads some day,
          but we will need to collaborate with podcasters and their ad networks to do so.
        </p>

        <hr />

        <h4
          className='offset-anchor-tag'
          id='what-does-open-source-mean'>
          What does open source (AGPLv3) mean?
        </h4>

        <p>
          AGPLv3 is the open source license under which all Podverse software is provided.
          The license states that anyone can download, modify, and use this software for any purposes for free,
          as long as they also share their changes to the code.
          This is also known as a "share-alike" or "copyleft" license.
        </p>

        <hr />

        <h4
          className='offset-anchor-tag'
          id='why-is-podverse-open-source'>
          Why is Podverse open source?
        </h4>

        <p>
          Podverse software is open source so anyone can launch their own
          podcast app as affordably as possible. If a podcast network wants to create their own podcast app,
          they can use Podverse software and do it for a tiny fraction of the cost
          of hiring programmers to build a podcast app from scratch.
        </p>
        <p>
          Our goal is to help level the playing field between the corporate world and independent media,
          so independent media has the same technological advantages as large corporations,
          and open source software is essential to that mission.
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
