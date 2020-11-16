/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { withTranslation } from '~/../i18n'
const { APP_DOWNLOAD_ON_THE_APP_STORE_URL, APP_GET_IT_ON_FDROID_URL,
  APP_GET_IT_ON_GOOGLE_PLAY_URL, BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  meta?: any
  pageKey?: string
  t?: any
}

type State = {}

class About extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[PV.pageKeys.about] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, pageKey: PV.pageKeys.about, namespacesRequired }
  }

  render() {
    const { t } = this.props

    const meta = {
      currentUrl: BASE_URL,
      description: t('pages:about._Description'),
      title: t('pages:about._Title')
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

        <h3>About</h3>
        <div className='about'>
          <p>
            Podverse is an open source podcast manager for iOS, Android, and web.
          </p>
          <label>Free features:</label>
          <ul>
            <li>Subscribe to podcasts</li>
            <li>Auto-download episodes</li>
            <li>Drag-and-drop queue</li>
            <li>Sleep timer</li>
            <li>Light / Dark mode</li>
          </ul>
          <label>Premium features:</label>
          <ul>
            <li>Create and share podcast clips</li>
            <li>Switch devices and play from where you left off</li>
            <li>Sync your subscriptions across devices</li>
            <li>Sync your queue across devices</li>
            <li>Create and share playlists</li>
            <li>Subscribe to playlists</li>
          </ul>
          <p>
            All Podverse software is provided under a free and open source (FOSS) licence.
            Features that require updating our servers are available only with a Premium membership.
            Sign up today and get 1 year of Premium for free <span role='img' aria-label='partying face emoji'>🥳</span>
          </p>
          <div className='flex-row flex-wrap'>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
              className="download-on-the-app-store no-radius"
              href={APP_DOWNLOAD_ON_THE_APP_STORE_URL}
            />
            <a
              className="get-it-on-google-play no-radius"
              href={APP_GET_IT_ON_GOOGLE_PLAY_URL}>
              <img
                alt='Get it on Google Play'
                src={PV.paths.web.googlePlayStoreBadge}
              />
            </a>
            <a
              className='get-it-on-fdroid no-radius'
              href={APP_GET_IT_ON_FDROID_URL}
              rel='noopener noreferrer'
              target='_blank' />
          </div>
        </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(About))
