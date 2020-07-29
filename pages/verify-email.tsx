import Link from 'next/link'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { alertRateLimitError } from '~/lib/utility'
import { modalsLoginShow, modalsSendVerificationEmailShow, pageIsLoading } from '~/redux/actions'
import { verifyEmail } from '~/services/auth'
const { BASE_URL } = config()

type Props = {
  hasError?: string
  meta?: any
  modalsLoginShow?: any
  modalsSendVerificationEmailShow?: any
}

type State = {}

class VerifyEmail extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const token = query.token

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.verify_email,
      description: PV.i18n.pages.verify_email._Description,
      title: PV.i18n.pages.verify_email._Title
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

  constructor(props) {
    super(props)

    this.state = {}
  }

  _showSendVerificationEmailModal = async () => {
    const { modalsSendVerificationEmailShow } = this.props
    modalsSendVerificationEmailShow(true)
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
              <h3>{PV.i18n.pages.verify_email.EmailVerified}</h3>
              <p>{PV.i18n.pages.verify_email.ThankYouForVerifying}</p>
              <p className='font-bolder'>
                <Link as={PV.paths.web._login} href={PV.paths.web._login}>
                  <a>{PV.i18n.core.Login}</a>
                </Link>
              </p>
            </Fragment>
        }
        {
          hasError &&
            <Fragment>
              <h3>{PV.i18n.pages.verify_email.EmailVerificationFailed}</h3>
              <p>{PV.i18n.pages.verify_email.EmailAlreadyVerifiedOrTokenExpired}</p>
              <p>
                <a href='#' onClick={this._showSendVerificationEmailModal}>
                  {PV.i18n.pages.verify_email.SendVerificationEmail}
                </a>
              </p>
            </Fragment>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  modalsSendVerificationEmailShow: bindActionCreators(modalsSendVerificationEmailShow, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
