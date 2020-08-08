import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import '~/scss/styles.scss'
import { withTranslation } from '~/../i18n'

type Props = {
  statusCode?: number
  t?: any
}

type State = {}

class ErrorPage extends Component<Props, State> {

  static getInitialProps({ res, err, store }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { namespacesRequired, statusCode }
  }

  render () {
    const { statusCode, t } = this.props
    let error = statusCode && errors(t)[statusCode]
    if (!error) error = errors(t).defaultError

    return (
      <div className='full-centered-content-view'>
        {
          error.header &&
            <h3>{error.header}</h3>
        }
        {
          error.icon &&
            <div className='error-icon'>
              <FontAwesomeIcon icon={error.icon} />
            </div>
        }
        {
          error.message1 &&
            <p>{error.message1}</p>
        }
        {
          error.message2 &&
            <p>{error.message2}</p>
        }
      </div>
    )
  }

}

const errors = (t) => {
  return {
    401: {
      message1: t('errorMessages:message.YouMustLoginToUseThisFeature')
    },
    404: {
      header: t('errorMessages:header.Error_404'),
      message1: t('errorMessages:message.PageNotFound')
    },
    500: {
      header: t('errorMessages:header.ServersUnderMaintenance'),
      message1: t('errorMessages:message.SiteOfflineUntilWorkIsComplete'),
      icon: 'tools'
    },
    defaultError: {
      header: t('errorMessages:header.SomethingWentWrong'),
      message1: t('errorMessages:message.AnUnknownErrorHasOccurred'),
      message2: t('errorMessages:message.CheckConnectionOrDifferentPage')
    }
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(ErrorPage))