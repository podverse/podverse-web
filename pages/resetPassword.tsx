import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Alert, Form, FormFeedback, FormGroup, FormText, Input, Label
  } from 'reactstrap'
import { ButtonGroup, PVButton as Button } from 'podverse-ui'
import Meta from '~/components/meta'
import { validatePassword } from '~/lib/utility'

type Props = {}

type State = {
  errorGeneral?: string
  errorPassword?: string
  errorPasswordConfirm?: string
  isLoading?: boolean
  password?: string
  passwordConfirm?: string
}

const errorsGeneral = {
  invalidFormat: 'Please provide a valid email address.'
}

class ResetPassword extends Component<Props, State> {

  static async getInitialProps({ query, req, store}) {
    return {}
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      passwordConfirm: ''
    }

    this.handlePasswordInputBlur = this.handlePasswordInputBlur.bind(this)
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this)
    this.handlePasswordConfirmInputBlur = this.handlePasswordConfirmInputBlur.bind(this)
    this.handlePasswordConfirmInputChange = this.handlePasswordConfirmInputChange.bind(this)
    this.hasConfirmedValidPassword = this.hasConfirmedValidPassword.bind(this)
  }

  handlePasswordInputBlur(event) {
    const { value: password } = event.target
    const newState: any = {}

    if (password && !validatePassword(password)) {
      newState.errorPassword = 'Password must contain a number, uppercase, lowercase, and be at least 8 characters long.'
    }

    this.setState(newState)
  }

  handlePasswordInputChange (event) {
    const { value: password } = event.target
    const newState: any = {}
    newState.password = password

    if (validatePassword(password)) {
      newState.errorPassword = null
    }

    this.setState(newState)
  }

  handlePasswordConfirmInputBlur (event) {
    const { errorPassword, password } = this.state
    const { value: passwordConfirm } = event.target
    const newState: any = {}

    if (!errorPassword && passwordConfirm !== password) {
      newState.errorPasswordConfirm = 'Passwords do not match.'
    }

    this.setState(newState)
  }

  handlePasswordConfirmInputChange (event) {
    const { errorPassword, password } = this.state
    const { value: passwordConfirm } = event.target
    const newState: any = {}
    newState.passwordConfirm = passwordConfirm

    if (!errorPassword && passwordConfirm === password ) {
      newState.errorPasswordConfirm = null
    }

    this.setState(newState)
  }

  handleSubmit() {
    const { email } = this.state
    this.clearErrors()
    this.props.handleSubmit(email)
  }

  hasConfirmedValidPassword() {
    const { password, passwordConfirm } = this.state

    return password === passwordConfirm
      && validatePassword(password)
      && validatePassword(passwordConfirm)
  }

  clearErrors() {
    this.setState({ errorGeneral: undefined })
  }

  render() {
    const { errorGeneral, errorPassword, errorPasswordConfirm, isLoading, password,
      passwordConfirm } = this.state

    return (
      <Fragment>
        <Meta />
        <Form className='reset-password'>
          <h4>Reset Password</h4>
          {
            errorGeneral &&
            <Alert color='danger'>
              {errorsGeneral[errorGeneral]}
            </Alert>
          }
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
              // valid={}
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
        </Form>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)