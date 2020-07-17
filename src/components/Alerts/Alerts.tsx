import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import { constants } from '~/lib/constants/misc'
import { getCookie, getViewContentsElementScrollTop, isBeforeDate } from '~/lib/utility'
import { modalsSendVerificationEmailShow, pageIsLoading, pagesSetQueryState } from '~/redux/actions'
const cookie = require('cookie')

type Props = {
  cookies: any
  modalsSendVerificationEmailShow?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  user?: any
}

type State = {
  hasSent?: boolean
  isVerifyEmailPage?: boolean
  isSending?: boolean
  modalsSendVerificationEmailShow?: boolean
  showEmailVerificationNeeded?: boolean
  showFreeTrialHasEnded?: boolean
  showFreeTrialWarning?: boolean
  showMembershipHasEnded?: boolean
  showMembershipWarning?: boolean
}

class Alerts extends Component<Props, State> {

  constructor (props) {
    super(props)

    const { cookies, user } = props
    this.state = this.generateStateObject(user, cookies)
  }

  componentWillReceiveProps(newProps) {
    const oldProps = this.props

    if (!oldProps.user.id && newProps.user.id || !newProps.user.id) {
      const cookies = {
        showFreeTrialHasEnded: getCookie(constants.cookies.showFreeTrialHasEnded),
        showFreeTrialWarning: getCookie(constants.cookies.showFreeTrialWarning),
        showMembershipHasEnded: getCookie(constants.cookies.showMembershipHasEnded),
        showMembershipWarning: getCookie(constants.cookies.showMembershipWarning),
      }
            
      this.setState(this.generateStateObject(newProps.user, cookies))
    }
  }

  componentDidMount() {
    const { user } = this.props
    const { emailVerified } = user
    if (user && user.id) {
      const isVerifyEmailPage = window.location.href.indexOf(constants.attributes.verify_email) >= 0
      this.setState({
        isVerifyEmailPage,
        ...(!emailVerified ? { showEmailVerificationNeeded: true } : { showEmailVerificationNeeded: false })
      })
    }
  }

  generateStateObject(user, cookies) {
    const { freeTrialExpiration, membershipExpiration } = user
    
    return {
      ...(!membershipExpiration && freeTrialExpiration && !isBeforeDate(freeTrialExpiration)
        && cookies.showFreeTrialHasEnded !== 'false'
        ? { showFreeTrialHasEnded: true } : { showFreeTrialHasEnded: false }),
      ...(!membershipExpiration && freeTrialExpiration
        && isBeforeDate(freeTrialExpiration) && !isBeforeDate(freeTrialExpiration, 7)
        && cookies.showFreeTrialWarning !== 'false'
        ? { showFreeTrialWarning: true } : { showFreeTrialWarning: false }),
      ...(membershipExpiration && !isBeforeDate(membershipExpiration)
        && cookies.showMembershipHasEnded !== 'false'
        ? { showMembershipHasEnded: true } : { showMembershipHasEnded: false }),
      ...(membershipExpiration && isBeforeDate(membershipExpiration)
        && !isBeforeDate(membershipExpiration, 30)
        && cookies.showMembershipWarning !== 'false'
        ? { showMembershipWarning: true } : { showMembershipWarning: false })
    }
  }

  hideAlert = stateKey => {
    const newState = {}
    newState[stateKey] = false
    this.setState(newState)

    const expires = new Date()
    expires.setDate(expires.getDate() + 6)
    const hideAlertCookie = cookie.serialize(stateKey, 'false', {
      expires,
      path: '/'
    })
    document.cookie = hideAlertCookie
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  _showSendVerificationEmailModal = async () => {
    const { modalsSendVerificationEmailShow } = this.props
    modalsSendVerificationEmailShow(true)
  }

  render() {
    const { hasSent, isSending, isVerifyEmailPage, showEmailVerificationNeeded, showFreeTrialHasEnded,
      showFreeTrialWarning, showMembershipHasEnded, showMembershipWarning } = this.state

    const renewLink = (
      <Link
        as={constants.paths.settings_membership}
        href={constants.paths.settings}>
        <a onClick={this.linkClick}>Renew</a>
      </Link>
    )

    if (showEmailVerificationNeeded && !isVerifyEmailPage) {
      return (
        <Alert
          color={constants.colors.warning}
          fade={false}
          isOpen={showEmailVerificationNeeded}
          toggle={() => this.hideAlert(constants.cookies.showEmailVerificationNeeded)}>
          {
            hasSent &&
              <Fragment>
                <p>{constants.src.components.Alerts.EmailSent}</p>
                <p>{constants.src.components.Alerts.PleaseCheckInbox}</p>
                <span>{constants.src.components.Alerts.PleaseEmail}<a href={constants.paths.support_podverse_fm}>{constants.src.components.Alerts.SupportEmail}</a>{constants.src.components.Alerts.ForHelp}</span>
              </Fragment>
          }
          {
            !hasSent && isSending &&
              <span>Email sending... <FontAwesomeIcon icon='spinner' spin /></span>
          }
          {
            !hasSent && !isSending &&
              <Fragment>
                <p>Please verify your email address to login.</p>
                <span><a href='#' onClick={this._showSendVerificationEmailModal}>send verification email</a></span>
              </Fragment>
          }
        </Alert>
      )
    } else if (showFreeTrialHasEnded) {
      return (
        <Alert
          color={constants.colors.danger}
          fade={false}
          isOpen={showFreeTrialHasEnded}
          toggle={() => this.hideAlert(constants.cookies.showFreeTrialHasEnded)}>
          {constants.src.components.Alerts.YourFreeTrialHasEnded(renewLink)}
        </Alert>
      )
    } else if (showFreeTrialWarning) {
      return (
        <Alert
          color={constants.colors.warning}
          fade={false}
          isOpen={showFreeTrialWarning}
          toggle={() => this.hideAlert(constants.cookies.showFreeTrialWarning)}>
          Your free trial will end soon. {renewLink} to continue using premium features.
        </Alert>
      )
    } else if (showMembershipHasEnded) {
      return (
        <Alert
          color={constants.colors.danger}
          fade={false}
          isOpen={showMembershipHasEnded}
          toggle={() => this.hideAlert(constants.cookies.showMembershipHasEnded)}>
          Your membership has expired. {renewLink} to continue using premium features.
        </Alert>
      )
    } else if (showMembershipWarning) {
      return (
        <Alert
          color={constants.colors.warning}
          fade={false}
          isOpen={showMembershipWarning}
          toggle={() => this.hideAlert(constants.cookies.showMembershipWarning)}>
          Your membership will expire soon. {renewLink} to continue using premium features.
        </Alert>
      )
    } else {
      return <React.Fragment />
    }
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsSendVerificationEmailShow: bindActionCreators(modalsSendVerificationEmailShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
