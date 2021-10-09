import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { withTranslation } from '~/../i18n'
const { PUBLIC_BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  pageKey?: string
  t?: any
  user: any
}

type State = {}

class History extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[PV.pageKeys.history] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, pageKey: PV.pageKeys.history, namespacesRequired }
  }

  render() {
    const { t, user } = this.props

    const isLoggedIn = user && user.id
    const historyItems = user && user.historyItems || []

    const meta = {
      currentUrl: PUBLIC_BASE_URL + PV.paths.web.history,
      description: t('pages:history._Description'),
      title: t('pages:history._Title')
    }

    const header = (
      <div className='history-modal__header'>
        <h3><FontAwesomeIcon icon='history' /> &nbsp;{t('History')}</h3>
      </div>
    )

    let historyItemNodes: any = []
    const historyModalHistoryItemKey = 'historyModalHistoryItemKey'
    historyItemNodes = Array.isArray(historyItems) ? historyItems.map((x, index) => (
      <MediaListItem
        dataNowPlayingItem={x}
        hasLink
        hideDescription={true}
        key={`${historyModalHistoryItemKey}${index}`}
        itemType='now-playing-item'
        t={t} />
    )) : []

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
        <div className='history-modal'>
          {header}
          {
            isLoggedIn
              ? historyItemNodes
              : <div className='no-results-msg'>{t('LoginToViewYourHistory')}</div>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(History))