import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PV from '~/lib/constants'
import { pageIsLoading } from '~/redux/actions'
import '~/scss/styles.scss'
import { withTranslation } from '~/../i18n'
import { convertMinutesToHHMM } from '~/lib/utility'

type Props = {
  errMsgBody?: any
  statusCode?: number
  t?: any
}

type State = {
  errMsgBody: any
  errorPageError: any
}

class ErrorPage extends Component<Props, State> {

  static getInitialProps({ res, err, store }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    store.dispatch(pageIsLoading(false))
    const namespacesRequired = PV.nexti18next.namespaces

    let errMsgBody = ''
    if (statusCode === 503) {
      errMsgBody = getErrorMessageBody(statusCode, res.data)
    }
    
    return { errMsgBody, namespacesRequired, statusCode }
  }

  constructor(props) {
    super(props)

    this.state = {
      errMsgBody: '',
      errorPageError: {}
    }
  }

  static getDerivedStateFromProps(newProps, currentState) {
    const { t } = newProps

    if (currentState.errMsgBody !== newProps.errMsgBody) {
      let error = newProps.statusCode && errors(t, newProps.errMsgBody)[newProps.statusCode]
      if (!error) error = errors(t, newProps.errMsgBody).defaultError

      return {
        errMsgBody: newProps.errMsgBody,
        errorPageError: error
      }
    }
    return null
  }

  render () {
    const { errorPageError } = this.state

    return (
      <div className='full-centered-content-view'>
        {
          errorPageError.header &&
            <h3>{errorPageError.header}</h3>
        }
        {
          errorPageError.icon &&
            <div className='error-icon'>
              <FontAwesomeIcon icon={errorPageError.icon} />
            </div>
        }
        {
          errorPageError.message1 &&
            <p>{errorPageError.message1}</p>
        }
        {
          errorPageError.message2 &&
            <p>{errorPageError.message2}</p>
        }
      </div>
    )
  }

}

const errors = (t, errMsgBody) => {
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
    503: errorServiceUnderScheduledMaintenance(t, errMsgBody),
    defaultError: {
      header: t('errorMessages:header.SomethingWentWrong'),
      message1: t('errorMessages:message.AnUnknownErrorHasOccurred'),
      message2: t('errorMessages:message.CheckConnectionOrDifferentPage')
    }
  }
}

const errorServiceUnderScheduledMaintenance = (t, errMsgBody) => {
  const expectedDowntimeRemainingText =
    errMsgBody && errMsgBody.expectedDowntimeRemaining
    && convertMinutesToHHMM(errMsgBody.expectedDowntimeRemaining)

  let message2 = ''
  if (expectedDowntimeRemainingText) {
    message2 = `${t('errorMessages:message.ExpectedDowntimeRemaining')} ${expectedDowntimeRemainingText}`
  }

  return {
    header: t('errorMessages:header.ServersUnderScheduledMaintenance'),
    message1: t('errorMessages:message.SiteOfflineUntilWorkIsComplete'),
    message2,
    icon: 'tools'
  }
}

const getErrorMessageBody = (statusCode, responseBody) => {
  let errorMessageBody = ''

  if (statusCode) {
    if (statusCode === 503) {
      errorMessageBody = responseBody
    }
  }

  return errorMessageBody
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(ErrorPage))