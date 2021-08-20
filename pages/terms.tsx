import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import { withTranslation } from '~/../i18n'
const { PUBLIC_BASE_URL } = config()

type Props = {
  t?: any
}

type State = {}

class Terms extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { namespacesRequired }
  }

  render() {
    const { t } = this.props

    const meta = {
      currentUrl: PUBLIC_BASE_URL + PV.paths.web.terms,
      description: t('pages:terms._Description'),
      title: t('pages:terms._Title'),
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
        <h3>{PV.i18n.pages.terms.TermsOfService}</h3>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_1}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_2}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_3}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_4}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_5}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_6}
        </p>
        <p>
          {PV.i18n.pages.terms.PodverseTerms_7}
        </p>
        <hr />
        <h3>{PV.i18n.pages.terms.PopularityAnalyticsHeader}</h3>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_1}
        </p>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_2}
        </p>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_3}
        </p>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_4}
        </p>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_5}
        </p>
        <p>
          {PV.i18n.pages.terms.PopularityAnalytics_6}
        </p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Terms))