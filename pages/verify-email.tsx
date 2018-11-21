import React, { Component, Fragment } from 'react'
import Meta from '~/components/meta'
import { verifyEmail } from '~/services/auth'

type Props = {
  hasError?: string
}

type State = {}

class VerifyEmail extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const token = query.token
    
    try {
      await verifyEmail(token)

      return {}
    } catch (error) {
      return { hasError: true }
    }
  }

  render() {
    const { hasError } = this.props

    return (
      <Fragment>
        <Meta />
        {
          !hasError &&
            <Fragment>
              <h4>Verification successful</h4>
              <p>have a nice day :)</p>
            </Fragment>
        }
        {
          hasError &&
            <Fragment>
              <h4>Verification failed</h4>
              <p>This token may have expired.</p>
              <p>Resend verification email</p>
            </Fragment>
        }
      </Fragment>
    )
  }
}

export default VerifyEmail
