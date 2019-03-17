import React, { Component, Fragment } from 'react'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow, alertRateLimitError } from '~/lib/utility'
import { pageIsLoading } from '~/redux/actions'
import { verifyEmail } from '~/services/auth'

type Props = {
  hasError?: string
  meta?: any
}

type State = {}

class VerifyEmail extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const token = query.token

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: `Verify your email address on Podverse`,
      title: `Verify your email address`
    }

    store.dispatch(pageIsLoading(false))
    
    try {
      await verifyEmail(token)

      return { meta }
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
        return
      }

      return { hasError: true, meta }
    }
  }

  render() {
    const { hasError, meta } = this.props

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
        {
          !hasError &&
            <Fragment>
              <h3>Verification successful</h3>
              <p>Have a nice day :)</p>
            </Fragment>
        }
        {
          hasError &&
            <Fragment>
              <h3>Verification failed</h3>
              <p>This token may have expired.</p>
              <p>Resend verification email</p>
            </Fragment>
        }
      </Fragment>
    )
  }
}

export default VerifyEmail
