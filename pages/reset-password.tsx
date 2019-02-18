import React, { Component, Fragment } from 'react'
import { Alert, Form, FormFeedback, FormGroup, FormText, Input, Label
  } from 'reactstrap'
import Router from 'next/router'
import { ButtonGroup, Button } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import { internetConnectivityErrorMessage } from '~/lib/constants/misc'
import { getUrlFromRequestOrWindow, validatePassword, alertRateLimitError } from '~/lib/utility'
import { resetPassword } from '~/services/auth'

type Props = {
  meta?: any
  passwordResetToken?: string
}

type State = {
  errorPassword?: string
  errorPasswordConfirm?: string
  errorResponse?: string
  isLoading?: boolean
  password?: string
  passwordConfirm?: string
  wasSuccessful?: boolean
}

class ResetPassword extends Component<Props, State> {

  static async getInitialProps({ query, req, store}) {
    const token = query.token

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Reset your account password on Podverse',
      title: `Reset Password`
    }

    return { meta, passwordResetToken: token }
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      passwordConfirm: ''
    }
  }

  handlePasswordInputBlur = event => {
    const { value: password } = event.target
    const newState: any = {}

    if (password && !validatePassword(password)) {
      newState.errorPassword = 'Password must contain a number, uppercase, lowercase, and be at least 8 characters long.'
    } else if (validatePassword(password)) {
      newState.errorPassword = null
    }

    this.setState(newState)
  }

  handlePasswordInputChange = event => {
    const { value: password } = event.target
    const newState: any = {}
    newState.password = password

    if (validatePassword(password)) {
      newState.errorPassword = null
    }

    this.setState(newState)
  }

  handlePasswordConfirmInputBlur = event => {
    const { errorPassword, password } = this.state
    const { value: passwordConfirm } = event.target
    const newState: any = {}

    if (!errorPassword && passwordConfirm !== password) {
      newState.errorPasswordConfirm = 'Passwords do not match.'
    }

    this.setState(newState)
  }

  handlePasswordConfirmInputChange = event => {
    const { errorPassword, password } = this.state
    const { value: passwordConfirm } = event.target
    const newState: any = {}
    newState.passwordConfirm = passwordConfirm

    if (!errorPassword && passwordConfirm === password ) {
      newState.errorPasswordConfirm = null
    }

    this.setState(newState)
  }

  handleSubmit = async () => {
    const { passwordResetToken } = this.props
    const { passwordConfirm } = this.state

    try {
      await resetPassword(passwordConfirm, passwordResetToken)

      this.setState({
        errorResponse: undefined,
        wasSuccessful: true
      })

      setTimeout(() => Router.push('/', '/'), 1500)
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        const errorMsg = (error.response && error.response.data) || internetConnectivityErrorMessage
        this.setState({ errorResponse: errorMsg })
      }
    }
  }

  hasConfirmedValidPassword = () => {
    const { password, passwordConfirm } = this.state

    return password === passwordConfirm
      && validatePassword(password)
      && validatePassword(passwordConfirm)
  }

  render() {
    const { meta } = this.props
    const { errorPassword, errorPasswordConfirm, errorResponse, isLoading, password,
      passwordConfirm, wasSuccessful } = this.state

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <Form className='reset-password'>
          <h3>Reset Password</h3>
          {
            (errorResponse && !isLoading) &&
            <Alert color='danger'>
              {errorResponse}
            </Alert>
          }
          {
            wasSuccessful &&
              <Alert color='primary'>
                Success! Redirecting to the home page...
              </Alert>
          }
          {
            !wasSuccessful &&
              <Fragment>
                <FormGroup>
                  <Label for='reset-password__password'>New Password</Label>
                  <Input
                    data-state-key='password'
                    invalid={errorPassword}
                    name='reset-password__password'
                    onBlur={this.handlePasswordInputBlur}
                    onChange={this.handlePasswordInputChange}
                    placeholder='********'
                    type='password'
                    value={password} />
                  {
                    errorPassword &&
                    <FormFeedback invalid='true'>
                      {errorPassword}
                    </FormFeedback>
                  }
                  {
                    (!validatePassword(password) && !errorPassword) &&
                    <FormText>
                      Password must contain a number, uppercase, lowercase, and be at least 8 characters long.
                    </FormText>
                  }
                </FormGroup>
                <FormGroup>
                  <Label for='reset-password__password-confirm'>Confirm Password</Label>
                  <Input
                    data-state-key='passwordConfirm'
                    invalid={errorPasswordConfirm}
                    name='reset-password__password-confirm'
                    onBlur={this.handlePasswordConfirmInputBlur}
                    onChange={this.handlePasswordConfirmInputChange}
                    placeholder='********'
                    type='password'
                    value={passwordConfirm} />
                  {
                    errorPasswordConfirm &&
                    <FormFeedback invalid='true'>
                      {errorPasswordConfirm}
                    </FormFeedback>
                  }
                </FormGroup>
                <ButtonGroup
                  childrenLeft
                  childrenRight={
                    <React.Fragment>
                      <Button
                        onClick={() => { window.location.href = '' }}
                        text='Cancel' />
                      <Button
                        color='primary'
                        disabled={!this.hasConfirmedValidPassword()}
                        isLoading={isLoading}
                        onClick={this.handleSubmit}
                        text='Submit' />
                    </React.Fragment>
                  } />
              </Fragment>
          }
        </Form>
      </Fragment>
    )
  }
}

export default ResetPassword
