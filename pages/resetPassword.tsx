import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Alert, Form, FormGroup, Input, Label } from 'reactstrap'
import { ButtonGroup, PVButton as Button } from 'podverse-ui'
import Meta from '~/components/meta'

type Props = {}

type State = {
  errorGeneral?: string
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

    this.state = {}
  }

  handleInputChange(event) {
    const { stateKey } = event.target.dataset
    const newState = {}
    newState[stateKey] = event.target.value
    this.setState(newState)
  }

  handleSubmit() {
    const { email } = this.state
    this.clearErrors()
    this.props.handleSubmit(email)
  }

  clearErrors() {
    this.setState({ errorGeneral: undefined })
  }

  render() {
    const { errorGeneral, isLoading, password, passwordConfirm } = this.state

    return (
      <Fragment>
        <Meta />
        <Form>
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
              name='reset-password__password'
              onChange={this.handleInputChange}
              placeholder='********'
              type='password'
              value={password} />
          </FormGroup>
          <FormGroup>
            <Label for='reset-password__password-confirm'>Confirm Password</Label>
            <Input
              data-state-key='passwordConfirm'
              name='reset-password__password-confirm'
              onChange={this.handleInputChange}
              placeholder='********'
              type='password'
              value={passwordConfirm} />
          </FormGroup>
          <ButtonGroup
            childrenLeft
            childrenRight={
              <React.Fragment>
                <Button
                  onClick={() => { window.location.href = '' }}
                  text='Cancel' />
                <Button
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