import { ComparisonTable } from 'podverse-ui'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading, pagesSetQueryState, modalsSignUpShow } from '~/redux/actions'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  modalsSignUpShow?: any
  pageKey?: string
  t: any
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
    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, namespacesRequired, pageKey: kPageKey }
  }

  showSignUp = () => {
    this.props.modalsSignUpShow(true)
  }

  render() {
    const { t } = this.props

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.membership,
      description: t('pages:membership._Description'),
      title: t('pages:membership._Title')
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
        <h3>{PV.i18n.common.Premium}</h3>

        <p className='membership-top-text'>
          Get 1 year free when you sign up for Podverse premium
        </p>
        <p className='membership-top-text'>
          $10/year after that
        </p>
        <div className='membership-join-list'>
          <a onClick={this.showSignUp}>
            Sign Up
          </a>
        </div>
        <ComparisonTable
          featuresData={featuresData}
          headerIcon1='Free'
          headerIcon2={PV.i18n.common.Premium}
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
    text: 'download episodes',
    icon1: true,
    icon2: true
  },
  {
    text: 'drag-and-drop queue',
    icon1: true,
    icon2: true
  },
  {
    text: 'sleep timer',
    icon1: true,
    icon2: true
  },
  {
    text: 'create clips of any length',
    icon1: false,
    icon2: true
  },
  {
    text: 'sync your subscriptions on all devices',
    icon1: false,
    icon2: true
  },
  {
    text: 'sync your queue on all devices',
    icon1: false,
    icon2: true
  },
  {
    text: 'create playlists',
    icon1: false,
    icon2: true
  },
  {
    text: 'edit your clips',
    icon1: false,
    icon2: true
  },
  {
    text: 'share your user profile',
    icon1: false,
    icon2: true
  },
  {
    text: 'download a backup of your data',
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
  modalsSignUpShow: bindActionCreators(modalsSignUpShow, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Membership))
