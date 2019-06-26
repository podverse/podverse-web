import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'reactstrap'
import Link from 'next/link'
import { getCookie, isBeforeDate } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
const cookie = require('cookie')

type Props = {
  cookies: any
  pageIsLoading?: any
  pageKey?: string
  user?: any
}

type State = {
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
        showFreeTrialHasEnded: getCookie('showFreeTrialHasEnded'),
        showFreeTrialWarning: getCookie('showFreeTrialWarning'),
        showMembershipHasEnded: getCookie('showMembershipHasEnded'),
        showMembershipWarning: getCookie('showMembershipWarning'),
      }
            
      this.setState(this.generateStateObject(newProps.user, cookies))
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

    const scrollPos = document.querySelector('.view__contents').scrollTop
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { showFreeTrialHasEnded, showFreeTrialWarning, showMembershipHasEnded,
      showMembershipWarning } = this.state

    const renewLink = (
      <Link
        as='/settings#membership'
        href='/settings'>
        <a onClick={this.linkClick}>Renew</a>
      </Link>
    )

    if (showFreeTrialHasEnded) {
      return (
        <Alert
          color="danger"
          fade={false}
          isOpen={showFreeTrialHasEnded}
          toggle={() => this.hideAlert('showFreeTrialHasEnded')}>
          Your free trial has ended. {renewLink} to continue using premium features.
      </Alert>
      )
    } else if (showFreeTrialWarning) {
      return (
        <Alert
          color="warning"
          fade={false}
          isOpen={showFreeTrialWarning}
          toggle={() => this.hideAlert('showFreeTrialWarning')}>
          Your free trial will end soon. {renewLink} to continue using premium features.
      </Alert>
      )
    } else if (showMembershipHasEnded) {
      return (
        <Alert
          color="danger"
          fade={false}
          isOpen={showMembershipHasEnded}
          toggle={() => this.hideAlert('showMembershipHasEnded')}>
          Your membership has ended. {renewLink} to continue using premium features.
      </Alert>
      )
    } else if (showMembershipWarning) {
      return (
        <Alert
          color="warning"
          fade={false}
          isOpen={showMembershipWarning}
          toggle={() => this.hideAlert('showMembershipWarning')}>
          Your membership will end soon. {renewLink} to continue using premium features.
      </Alert>
      )
    } else {
      return <React.Fragment />
    }
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
