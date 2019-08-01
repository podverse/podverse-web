import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ForgotPasswordModal, LoginModal, SignUpModal } from 'podverse-ui'
import { internetConnectivityErrorMessage } from '~/lib/constants/misc'
import { modalsForgotPasswordIsLoading, modalsForgotPasswordShow, 
  modalsForgotPasswordSetErrorResponse, modalsLoginIsLoading,
  modalsLoginShow, modalsLoginSetErrorResponse, modalsSignUpIsLoading,
  modalsSignUpShow, modalsSignUpSetErrorResponse, userSetInfo, playerQueueLoadPriorityItems } from '~/redux/actions'
import { login, sendResetPassword, signUp } from '~/services/auth'
import { alertRateLimitError } from '~/lib/utility';

type Props = {
  modals?: any
  modalsForgotPasswordIsLoading?: any
  modalsForgotPasswordSetErrorResponse?: any
  modalsForgotPasswordShow?: any
  modalsLoginIsLoading?: any
  modalsLoginSetErrorResponse?: any
  modalsLoginShow?: any
  modalsSignUpIsLoading?: any
  modalsSignUpSetErrorResponse?: any
  modalsSignUpShow?: any
  playerQueueLoadPriorityItems?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class Auth extends Component<Props, State> {

  handleForgotPasswordSubmit = async email => {
    const { modalsForgotPasswordIsLoading, modalsForgotPasswordSetErrorResponse,
      modalsForgotPasswordShow } = this.props
    modalsForgotPasswordIsLoading(true)

    try {
      await sendResetPassword(email)
      modalsForgotPasswordShow(false)
      modalsForgotPasswordSetErrorResponse(null)
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        const errorMsg = (error.response && error.response.data && error.response.data.message) || internetConnectivityErrorMessage
        modalsForgotPasswordSetErrorResponse(errorMsg)
      }
    } finally {
      modalsForgotPasswordIsLoading(false)
    }
  }

  handleLogin = async (email, password) => {
    const { modalsLoginIsLoading, modalsLoginSetErrorResponse, modalsLoginShow,
      playerQueueLoadPriorityItems, userSetInfo } = this.props
    modalsLoginIsLoading(true)
    
    try {
      const authenticatedUserInfo = await login(email, password)
      userSetInfo(authenticatedUserInfo && authenticatedUserInfo.data)
      playerQueueLoadPriorityItems(authenticatedUserInfo && authenticatedUserInfo.data && authenticatedUserInfo.data.queueItems)
      modalsLoginShow(false)
      modalsLoginSetErrorResponse()
      modalsLoginIsLoading(false)
      window.location.reload()
    } catch (error) {
      const errorMsg = (error.response && error.response.data && error.response.data.message) || internetConnectivityErrorMessage
      modalsLoginSetErrorResponse(errorMsg)
      modalsLoginIsLoading(false)
      userSetInfo({
        email: null,
        freeTrialExpiration: null,
        historyItems: [],
        id: null,
        isPublic: null,
        mediaRefs: [],
        membershipExpiration: null,
        name: null,
        playlists: [],
        queueItems: [],
        subscribedPlaylistIds: [],
        subscribedPodcastIds: [],
        subscribedUserIds: []
      })
    }
  }

  handleSignUp = async (email, password) => {
    const { modalsSignUpIsLoading, modalsSignUpSetErrorResponse, userSetInfo } = this.props
    modalsSignUpIsLoading(true)

    try {
      await signUp(email, password)
      window.location.reload()
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        const errorMsg = (error.response && error.response.data && error.response.data.message) || internetConnectivityErrorMessage
        modalsSignUpSetErrorResponse(errorMsg)
      }
      userSetInfo({
        historyItems: [],
        id: null,
        isPublic: null,
        name: null,
        mediaRefs: [],
        playlists: [],
        queueItems: [],
        subscribedPodcastIds: [],
        subscribedUserIds: []
      })
    } finally {
      modalsSignUpIsLoading(false)
    }
  }

  render() {
    const { modals, modalsForgotPasswordShow, modalsLoginShow, modalsSignUpShow
      } = this.props
    const { forgotPassword, login, signUp } = modals

    const signUpTopText = (
      <React.Fragment>
        <br />
        <p style={{ textAlign: 'center' }}>
          Podverse premium accounts are currently available by invite only.
          <br />
          <br />
          <a
            href='https://docs.google.com/forms/d/e/1FAIpQLSd0LJcAQ4zViL7lrl-yg192kHOQN49rvcLcf_RPTcPn-wjmgg/viewform?usp=sf_link'
            style={{ fontWeight: 500 }}
            target='_blank'>
            Join Waiting List
          </a>
        </p>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <ForgotPasswordModal
          errorResponse={forgotPassword.errorResponse}
          handleSubmit={this.handleForgotPasswordSubmit}
          hideModal={() => modalsForgotPasswordShow(false)}
          isLoading={modals.forgotPassword && modals.forgotPassword.isLoading}
          isOpen={(modals.forgotPassword && modals.forgotPassword.isOpen)}
          isResetPassword={modals.forgotPassword && modals.forgotPassword.isResetPassword} />
        <LoginModal
          errorResponse={login.errorResponse}
          handleLogin={this.handleLogin}
          hideModal={() => modalsLoginShow(false)}
          isLoading={modals.login && modals.login.isLoading}
          isOpen={modals.login && modals.login.isOpen}
          showForgotPasswordModal={() => modalsForgotPasswordShow(true)}
          showSignUpModal={() => modalsSignUpShow(true)} />
        <SignUpModal
          errorResponse={signUp.errorResponse}
          handleSignUp={this.handleSignUp}
          hideModal={() => modalsSignUpShow(false)}
          isLoading={modals.signUp && modals.signUp.isLoading}
          isOpen={modals.signUp && modals.signUp.isOpen}
          topText={signUpTopText} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsForgotPasswordIsLoading: bindActionCreators(modalsForgotPasswordIsLoading, dispatch),
  modalsForgotPasswordShow: bindActionCreators(modalsForgotPasswordShow, dispatch),
  modalsForgotPasswordSetErrorResponse: bindActionCreators(modalsForgotPasswordSetErrorResponse, dispatch),
  modalsLoginIsLoading: bindActionCreators(modalsLoginIsLoading, dispatch),
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  modalsLoginSetErrorResponse: bindActionCreators(modalsLoginSetErrorResponse, dispatch),
  modalsSignUpIsLoading: bindActionCreators(modalsSignUpIsLoading, dispatch),
  modalsSignUpShow: bindActionCreators(modalsSignUpShow, dispatch),
  modalsSignUpSetErrorResponse: bindActionCreators(modalsSignUpSetErrorResponse, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
