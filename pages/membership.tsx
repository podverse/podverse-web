import { ComparisonTable } from 'podverse-ui'
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

const kPageKey = 'membership'

class Membership extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Podverse - Membership Info',
      title: 'A list of features available on Podverse.'
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

        <h3>Membership</h3>

        <p className='membership-top-text'>
          Podverse premium is currently available by invite only.
        </p>
        <div className='membership-join-list'>
          <a
            href='https://docs.google.com/forms/d/e/1FAIpQLSd0LJcAQ4zViL7lrl-yg192kHOQN49rvcLcf_RPTcPn-wjmgg/viewform?usp=sf_link'
            target='_blank'>
            Join Waiting List
          </a>
        </div>
        <ComparisonTable
          featuresData={featuresData}
          headerIcon1='Free'
          headerIcon2='Premium'
          headerText='Features' />
      </Fragment>
    )
  }
}

const featuresData = [
  {
    text: 'subscribe to podcasts',
    icon1: true,
    icon2: true
  },
  {
    text: 'play clips and episodes',
    icon1: true,
    icon2: true
  },
  {
    text: 'manage your queue',
    icon1: true,
    icon2: true
  },
  {
    text: 'create clips of any length',
    icon1: true,
    icon2: true
  },
  {
    text: 'create more discoverable clips',
    icon1: false,
    icon2: true
  },
  {
    text: 'edit your clips',
    icon1: false,
    icon2: true
  },
  {
    text: 'create playlists',
    icon1: false,
    icon2: true
  },
  {
    text: 'share your profile',
    icon1: false,
    icon2: true
  },
  {
    text: 'sync your queue across all devices',
    icon1: false,
    icon2: true
  },
  {
    text: 'support open source software',
    icon1: true,
    icon2: true,
    iconType: 'smile'
  }
]

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Membership)
