import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  pageKey?: string
  t: any
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

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, pageKey: kPageKey, namespacesRequired }
  }

  render () {
    const { t } = this.props

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.faq,
      description: t('pages:faq._Description'),
      title: t('pages:faq._Title')
    }

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

        <p><a href={`mailto:${PV.misc.email.contact}`} target='_blank' rel="noopener noreferrer">Contact Us / Ask a question</a></p>
        
        <h3>Table of Contents</h3>

        <ul>
          <li>
            <a href='#why-do-some-clips-start-at-the-wrong-time'>Why do some clips start at the wrong time? (dynamic ads)</a>
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
          id='why-do-some-clips-start-at-the-wrong-time'>
          Why do some clips start at the wrong time?
        </h4>
        <p>
          Most podcast apps today limit your clips to be less than a minute long,
          but Podverse lets you create and share podcast clips of any length.
          This approach for clip sharing has a tradeoff however,
          as it currently does not support clips from podcasts that insert dynamic ads.
        </p>
        <p>
          Dynamic ads are different advertisements that are rotated into the same episode,
          so each listener can hear a different series of advertisements.
          Since dynamic ads change the overall length of the episode,
          the timestamps of clips created from that episode may not stay accurate.
        </p>
        <p>
          We would love to add full support for podcasts with dynamic ads some day, and we can,
          but for fair use / legal reasons we will need to get permission from each podcaster to do so.
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(FAQ))