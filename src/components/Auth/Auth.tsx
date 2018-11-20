import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ForgotPasswordModal, LoginModal, SignUpModal } from 'podverse-ui'
import { modalsForgotPasswordIsLoading, modalsForgotPasswordShow, modalsLoginIsLoading,
  modalsLoginShow, modalsSignUpIsLoading, modalsSignUpShow, userSetIsLoggedIn
  } from '~/redux/actions'
import { login, sendResetPassword, signUp } from '~/services/auth'

type Props = {
  modals?: any
  modalsForgotPasswordIsLoading?: any
  modalsForgotPasswordShow?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  modalsSignUpIsLoading?: any
  modalsSignUpShow?: any
  user?: any
  userSetIsLoggedIn?: any
}

type State = {}

class Auth extends Component<Props, State> {

  constructor (props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleForgotPasswordSubmit = this.handleForgotPasswordSubmit.bind(this)
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this)
  }

  async handleForgotPasswordSubmit (email) {
    const { modalsForgotPasswordIsLoading, modalsForgotPasswordShow } = this.props
    modalsForgotPasswordIsLoading(true)

    try {
      await sendResetPassword(email)
      modalsForgotPasswordShow(false)
    } catch {

    } finally {
      modalsForgotPasswordIsLoading(false)
    }
  }

  async handleLogin (email, password) {
    const { modalsLoginIsLoading, modalsLoginShow, userSetIsLoggedIn } = this.props
    modalsLoginIsLoading(true)
    
    try {
      await login(email, password)
      userSetIsLoggedIn(true)
      modalsLoginShow(false)
    } catch {
      userSetIsLoggedIn(false)
    } finally {
      modalsLoginIsLoading(false)
    }
  }

  async handleSignUpSubmit (email, password) {
    const { modalsSignUpIsLoading, modalsSignUpShow, userSetIsLoggedIn } = this.props
    modalsSignUpIsLoading(true)

    try {
      await signUp(email, password)
      userSetIsLoggedIn(true)
      modalsSignUpShow(false)
    } catch {
      userSetIsLoggedIn(false)
    } finally {
      modalsSignUpIsLoading(false)
    }
  }

  render () {
    const { modals, modalsForgotPasswordShow, modalsLoginShow, modalsSignUpShow
      } = this.props
  
    return (
      <React.Fragment>
        <ForgotPasswordModal
          handleSubmit={this.handleForgotPasswordSubmit}
          hideModal={() => modalsForgotPasswordShow(false)}
          isLoading={modals.forgotPassword && modals.forgotPassword.isLoading}
          isOpen={modals.forgotPassword && modals.forgotPassword.isOpen} />
        <LoginModal
          handleLogin={this.handleLogin}
          hideModal={() => modalsLoginShow(false)}
          isLoading={modals.login && modals.login.isLoading}
          isOpen={modals.login && modals.login.isOpen}
          showForgotPasswordModal={() => modalsForgotPasswordShow(true)}
          showSignUpModal={() => modalsSignUpShow(true)} />
        <SignUpModal
          handleSignUp={this.handleSignUpSubmit}
          hideModal={() => modalsSignUpShow(false)}
          isLoading={modals.signUp && modals.signUp.isLoading}
          isOpen={modals.signUp && modals.signUp.isOpen} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsForgotPasswordIsLoading: bindActionCreators(modalsForgotPasswordIsLoading, dispatch),
  modalsForgotPasswordShow: bindActionCreators(modalsForgotPasswordShow, dispatch),
  modalsLoginIsLoading: bindActionCreators(modalsLoginIsLoading, dispatch),
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  modalsSignUpIsLoading: bindActionCreators(modalsSignUpIsLoading, dispatch),
  modalsSignUpShow: bindActionCreators(modalsSignUpShow, dispatch),
  userSetIsLoggedIn: bindActionCreators(userSetIsLoggedIn, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
