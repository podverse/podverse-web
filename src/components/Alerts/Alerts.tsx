import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, Fragment } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import PV from '~/lib/constants'
import { getCookie, getViewContentsElementScrollTop, isBeforeDate } from '~/lib/utility'
import { modalsSendVerificationEmailShow, pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { i18n } from '../../../i18n'
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
        showFreeTrialHasEnded: getCookie(PV.cookies.showFreeTrialHasEnded),
        showFreeTrialWarning: getCookie(PV.cookies.showFreeTrialWarning),
        showMembershipHasEnded: getCookie(PV.cookies.showMembershipHasEnded),
        showMembershipWarning: getCookie(PV.cookies.showMembershipWarning),
      }
            
      this.setState(this.generateStateObject(newProps.user, cookies))
    }
  }

  componentDidMount() {
    const { user } = this.props
    const { emailVerified } = user
    if (user && user.id) {
      const isVerifyEmailPage = window.location.href.indexOf(PV.attributes.verify_email) >= 0
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
        as={PV.paths.web.settings_membership}
        href={PV.paths.web.settings}>
        <a onClick={this.linkClick}>{PV.i18n.common.Renew}</a>
      </Link>
    )

    if (showEmailVerificationNeeded && !isVerifyEmailPage) {
      return (
        <Alert
          color={PV.colors.warning}
          fade={false}
          isOpen={showEmailVerificationNeeded}
          toggle={() => this.hideAlert(PV.cookies.showEmailVerificationNeeded)}>
          {
            hasSent &&
              <Fragment>
                <p>{PV.i18n.common.EmailSent}</p>
                <p>{PV.i18n.common.PleaseCheckInbox}</p>
                <span>
                  <Trans i18n={i18n} i18nKey='ContactSupport'>
                    If it still doesn't appear, please email <a href={PV.paths.web.support_podverse_fm}>{PV.misc.supportEmail}</a> for help.
                  </Trans>
                </span>
              </Fragment>
          }
          {
            !hasSent && isSending &&
              <span>{PV.i18n.common.EmailSending}<FontAwesomeIcon icon='spinner' spin /></span>
          }
          {
            !hasSent && !isSending &&
              <Fragment>
                <p>{PV.i18n.common.PleaseVerifyEmail}</p>
                <span><a href='#' onClick={this._showSendVerificationEmailModal}>{PV.i18n.common.SendVerificationEmail}</a></span>
              </Fragment>
          }
        </Alert>
      )
    } else if (showFreeTrialHasEnded) {
      return (
        <Alert
          color={PV.colors.danger}
          fade={false}
          isOpen={showFreeTrialHasEnded}
          toggle={() => this.hideAlert(PV.cookies.showFreeTrialHasEnded)}>
          {PV.i18n.common.YourFreeTrialHasEnded(renewLink)}
        </Alert>
      )
    } else if (showFreeTrialWarning) {
      return (
        <Alert
          color={PV.colors.warning}
          fade={false}
          isOpen={showFreeTrialWarning}
          toggle={() => this.hideAlert(PV.cookies.showFreeTrialWarning)}>
          {PV.i18n.common.YourFreeTrialWillEndSoon(renewLink)}
        </Alert>
      )
    } else if (showMembershipHasEnded) {
      return (
        <Alert
          color={PV.colors.danger}
          fade={false}
          isOpen={showMembershipHasEnded}
          toggle={() => this.hideAlert(PV.cookies.showMembershipHasEnded)}>
          {PV.i18n.common.YourMembershipHasExpired(renewLink)}
        </Alert>
      )
    } else if (showMembershipWarning) {
      return (
        <Alert
          color={PV.colors.warning}
          fade={false}
          isOpen={showMembershipWarning}
          toggle={() => this.hideAlert(PV.cookies.showMembershipWarning)}>
          {PV.i18n.common.YourMembershipWillExpireSoon(renewLink)}
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
