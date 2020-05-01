import Router from 'next/router'
import { Button } from 'podverse-ui'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Input } from 'reactstrap'
import { bindActionCreators } from 'redux'
import Error from './_error'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import { fireConfetti } from '~/lib/utility'
import { modalsSignUpShow, pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getAccountClaimToken, redeemAccountClaimToken } from '~/services'
const { BASE_URL } = config()

type Props = {
  errorCode?: number
  id?: string
  lastScrollPosition?: number
  meta?: any
  modalsSignUpShow?: any
  page?: any
  pageKey?: string
  pageIsLoading?: any
}

type State = {
  accountClaimToken?: any
  email?: string
  isRedeeming?: boolean
}

interface Redeem {
  refEmailInput: any
}

const kPageKey = 'redeem'

class Redeem extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { pages } = state
    const { id } = query

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    const meta = {
      currentUrl: BASE_URL + '/coupon/' + id,
      description: 'Redeem your special offer',
      title: 'Podverse - Coupon'
    }

    return { id, lastScrollPosition, meta, pageKey: kPageKey }
  }

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      isRedeeming: false
    }

    this.refEmailInput = React.createRef()
  }

  async componentDidMount() {
    const { id, pageIsLoading } = this.props
    let accountClaimToken
    try {
      if (!id) return
      const accountClaimTokenResult = await getAccountClaimToken(id)
      accountClaimToken = accountClaimTokenResult.data
      this.setState({ accountClaimToken })
      pageIsLoading(false)
      setTimeout(() => {
        fireConfetti()
      }, 1000)
    } catch (err) {
      Router.push('/')
    }
  }

  _redeem = async () => {
    const { accountClaimToken } = this.state
    const { value: email } = this.refEmailInput.current

    if (accountClaimToken && accountClaimToken.id && email) {
      this.setState({ isRedeeming: true })
      try {
        await redeemAccountClaimToken(accountClaimToken.id, email)
        alert('Success! Redirecting to the home page...')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message)
        }
      }
      this.setState({ isRedeeming: false })
    }
  }

  handleEmailKeyPress = (event: any) => {
    const { value: email } = event.target
    this.setState({ email })
  }

  showSignUp = () => {
    this.props.modalsSignUpShow(true)
  }

  render() {
    const { errorCode, meta, page } = this.props
    const { isLoading } = page
    const { accountClaimToken = {}, email, isRedeeming } = this.state

    if (errorCode) {
      return <Error statusCode={errorCode} />
    }

    const yearText = accountClaimToken.yearsToAdd === 1 ? 'year ' : 'years '

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
          !isLoading &&
            <div className='redeem'>
              <p>
                This coupon is good for {accountClaimToken.yearsToAdd} {yearText} of Podverse premium
                <span role='img' aria-label='partying face emoji'> 🥳</span>
              </p>
              <p>
                1) <a onClick={this.showSignUp}>Sign up</a> on Podverse (if you haven't already).
              </p>
              <p>
                2) Type your email then press Redeem.
              </p>
              <FormGroup>
                <Input
                  defaultValue=''
                  innerRef={this.refEmailInput}
                  name='redeem__email'
                  onChange={this.handleEmailKeyPress}
                  placeholder='your email'
                  type='input' />
              </FormGroup>
              <Button color='primary' disabled={!email} isLoading={isRedeeming} onClick={this._redeem}>
                Redeem
              </Button>
            </div>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsSignUpShow: bindActionCreators(modalsSignUpShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Redeem)
