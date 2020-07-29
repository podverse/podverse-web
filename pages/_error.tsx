import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import '~/scss/styles.scss'

type Props = {
  statusCode?: number
}

type State = {}

class ErrorPage extends Component<Props, State> {

  static getInitialProps({ res, err, store }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    store.dispatch(pageIsLoading(false))
    return { statusCode }
  }

  render () {
    const { statusCode } = this.props
    let error = statusCode && errors[statusCode]
    if (!error) error = errors.defaultError

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

const errors = {
  401: {
    header: PV.i18n.errorMessages.header.LoginNeeded,
    message1: PV.i18n.errorMessages.message.YouMustLoginToUseThisFeature
  },
  404: {
    header: PV.i18n.errorMessages.header.Error_404,
    message1: PV.i18n.errorMessages.message.PageNotFound
  },
  500: {
    header: PV.i18n.errorMessages.header.ServersUnderMaintenance,
    message1: PV.i18n.errorMessages.message.SiteOfflineUntilWorkIsComplete,
    icon: 'tools'
  },
  defaultError: {
    header: PV.i18n.errorMessages.header.SomethingWentWrong,
    message1: PV.i18n.errorMessages.message.AnUnknownErrorHasOccurred,
    message2: PV.i18n.errorMessages.message.CheckConnectionOrDifferentPage
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage)
