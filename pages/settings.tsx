import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, FormFeedback, FormGroup, FormText, Input, InputGroup, InputGroupAddon,
  Label } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import CheckoutModal from '~/components/CheckoutModal/CheckoutModal'
import { DeleteAccountModal } from '~/components/DeleteAccountModal/DeleteAccountModal'
import { alertPremiumRequired, alertSomethingWentWrong, convertToYYYYMMDDHHMMSS,
  copyToClipboard, getUrlFromRequestOrWindow, isBeforeDate, validateEmail, alertRateLimitError
  } from '~/lib/utility'
import { modalsSignUpShow, pageIsLoading, settingsHideFilterButton, settingsHideNSFWMode,
  settingsHideUITheme, userSetInfo } from '~/redux/actions'
import { downloadUserData, updateUser } from '~/services'
import config from '~/config'
const { BASE_URL } = config()
const fileDownload = require('js-file-download')
const cookie = require('cookie')

type Props = {
  meta?: any
  modalsSignUpShow?: any
  settings?: any
  settingsHideFilterButton?: any
  settingsHideNSFWMode?: any
  settingsHideUITheme?: any
  user?: any
  userSetInfo?: any
}

type State = {
  email?: string
  emailError?: string
  isCheckoutOpen?: boolean
  isDeleteAccountOpen?: boolean
  isDeleting?: boolean
  isDownloading?: boolean
  isPublic?: boolean
  isSaving?: boolean
  name?: string
  wasCopied?: boolean
}

class Settings extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Customize my account settings on Podverse.',
      title: `Settings`
    }

    return { meta }
  }

  constructor(props) {
    super(props)
    const { user } = props

    this.state = {
      ...(user.email ? { email: user.email } : {}),
      isDownloading: false,
      ...(user.isPublic || user.isPublic === false ? {isPublic: user.isPublic} : {}),
      ...(user.name ? {name: user.name} : {})
    }
  }

  profileLinkHref = () => {
    const { user } = this.props
    return `${BASE_URL}/profile/${user.id}`
  }

  copyProfileLink = () => {
    copyToClipboard(this.profileLinkHref())
    this.setState({ wasCopied: true })
    setTimeout(() => {
      this.setState({ wasCopied: false })
    }, 3000)
  }

  componentWillReceiveProps (newProps) {
    const oldProps = this.props
    
    if (!oldProps.user.id && newProps.user.id) {
      this.setState({
        email: newProps.user.email,
        isPublic: newProps.user.isPublic,
        name: newProps.user.name
      })
    }
  }

  downloadUserData = async () => {
    this.setState({ isDownloading: true })
    const { user } = this.props

    try {
      const userData = await downloadUserData(user.id)
      fileDownload(JSON.stringify(userData.data), `podverse-${convertToYYYYMMDDHHMMSS()}`)
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alert('Something went wrong. Please check your internet connection.')
      }
      console.log(error)
    }

    this.setState({ isDownloading: false })
  }

  handleEmailChange = event => {
    const email = event.target.value
    this.setState({ email })
  }

  handleNameChange = event => {
    const name = event.target.value
    this.setState({ name })
  }

  handlePrivacyChange = event => {
    const isPublic = event.target.value
    this.setState({ isPublic: isPublic === 'public' })
  }

  handleToggleNSFWMode = event => {
    const { settingsHideNSFWMode } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const nsfwModeHideCookie = cookie.serialize('nsfwModeHide', val, {
      expires,
      path: '/'
    })
    document.cookie = nsfwModeHideCookie
        
    settingsHideNSFWMode(`${val}`)
  }

  handleToggleUITheme = event => {
    const { settingsHideUITheme } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const uiThemeHideCookie = cookie.serialize('uiThemeHide', val, {
      expires,
      path: '/'
    })
    document.cookie = uiThemeHideCookie

    settingsHideUITheme(`${val}`)
  }

  handleToggleFilterButton = event => {
    const { settingsHideFilterButton } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const filterButtonHideCookie = cookie.serialize('filterButtonHide', val, {
      expires,
      path: '/'
    })
    document.cookie = filterButtonHideCookie

    settingsHideFilterButton(`${val}`)
  }

  validateProfileData = () => {
    const { user } = this.props
    const { email: oldEmail, isPublic: oldIsPublic, name: oldName } = user
    const { email: newEmail, isPublic: newIsPublic, name: newName } = this.state

    return (
      (oldEmail !== newEmail && validateEmail(newEmail))
      || (oldName !== newName && (!newEmail || validateEmail(newEmail))
      || (oldIsPublic !== newIsPublic && (!newEmail || validateEmail(newEmail))))
    )
  }

  validateEmail = () => {
    const { email } = this.state
    if (!validateEmail(email)) {
      this.setState({ emailError: 'Please provide a valid email address' })
    } else {
      this.setState({ emailError: '' })
    }
  }

  resetProfileChanges = () => {
    const { user } = this.props
    const { email, name } = user
    this.setState({ email, name })
  }

  updateProfile = async () => {
    this.setState({ isSaving: true })
    const { user, userSetInfo } = this.props
    const { id } = user
    const { email, isPublic, name } = this.state

    try {
      const newData = { email, id, isPublic, name }
      await updateUser(newData)
      userSetInfo(newData)
    } catch (error) {
      if (error && error.response && error.response.data === 'Premium Membership Required') {
        alertPremiumRequired()
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong()
      }
    }

    this.setState({ isSaving: false })
  }

  showSignUpModal = () => {
    const { modalsSignUpShow } = this.props
    modalsSignUpShow(true)
  }

  toggleCheckoutModal = show => {
    this.setState({ isCheckoutOpen: show })
  }
  
  toggleDeleteAccountModal = show => {
    this.setState({ isDeleteAccountOpen: show })
  }
  
  render() {
    const { meta, settings, user } = this.props
    const { filterButtonHide, nsfwModeHide, uiThemeHide } = settings
    const { email, emailError, isCheckoutOpen, isDeleteAccountOpen, isDownloading,
      isPublic, isSaving, name, wasCopied } = this.state
    const isLoggedIn = user && !!user.id
    
    const checkoutBtn = (isRenew = false) => (
      <Button
        className='settings-membership__checkout'
        color='primary'
        onClick={() => this.toggleCheckoutModal(true)}>
        <FontAwesomeIcon icon='shopping-cart' />&nbsp;&nbsp;{isRenew ? 'Renew' : 'Checkout'}
      </Button>
    )

    const premiumMembershipNode = (
      <Fragment>
        <p>Premium features include:</p>
        <ul>
          <li>Create and share playlists</li>
          <li>Edit your clips</li>
          <li>Sync your queue on all devices</li>
          <li>Sync your podcast list on all devices</li>
          <li>Share your user profile</li>
          <li>Own your personal data</li>
          <li>Support open-source software</li>
        </ul>
        <p>$3 per year, checkout with PayPal or BitPay</p>
        <div className='settings-membership__btns'>
          {
            !user || !user.id &&
              <Button
                className='settings-membership__free-trial'
                color='primary'
                onClick={this.showSignUpModal}>
                Start Free Trial
              </Button>
          }
        </div>
      </Fragment>
    )

    const membershipStatusHeader = <h4 id='membership'>Membership Status</h4>

    return (
      <div className='settings'>
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
        <h3>Settings</h3>
        <Form>
          {
            isLoggedIn &&
              <Fragment>
                <FormGroup>
                  <Label for='settings-name'>Name</Label>
                  <Input 
                    id='settings-name'
                    name='settings-name'
                    onChange={this.handleNameChange}
                    placeholder='anonymous'
                    type='text'
                    value={name} />
                  <FormText>May appear next to content you create</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for='settings-name'>Email</Label>
                  <Input
                    id='settings-email'
                    invalid={emailError}
                    name='settings-email'
                    onBlur={this.validateEmail}
                    onChange={this.handleEmailChange}
                    placeholder=''
                    type='text'
                    value={email} />
                  {
                    emailError &&
                      <FormFeedback invalid='true'>
                        {emailError}
                      </FormFeedback>
                  }
                </FormGroup>
                <FormGroup>
                  <Label for='settings-privacy'>Profile Privacy</Label>
                  <Input
                    className='settings-privacy'
                    name='settings-privacy'
                    onChange={this.handlePrivacyChange}
                    type='select'
                    value={isPublic ? 'public' : 'private'}>
                    <option value='public'>Public</option>
                    <option value='private'>Private</option>
                  </Input>
                  {
                    isPublic ?
                      <FormText>Podcasts, clips, and playlists are visible on your profile page.</FormText>
                      : <FormText>Your profile page is hidden. Your public links are still accessible.</FormText>
                  }
                </FormGroup>
                {
                  (user.isPublic && isPublic) &&
                  <FormGroup style={{marginBottom: '2rem'}}>
                    <Label for='settings-privacy-profile-link'>Sharable Profile Link</Label>
                    <InputGroup id='settings-privacy-profile-link'>
                      <Input
                        readOnly={true}
                        value={`${BASE_URL}/profile/${user.id}`} />
                      <InputGroupAddon
                        addonType='append'>
                        <Button
                          color='primary'
                          onClick={this.copyProfileLink}
                          text={wasCopied ? 'Copied!' : 'Copy'} />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                }
                <div className='settings-profile__btns'>
                  <Button
                    className='settings-profile-btns__cancel'
                    onClick={this.resetProfileChanges}>
                    Cancel
                  </Button>
                  <Button
                    className='settings-profile-btns__save'
                    color='primary'
                    disabled={!this.validateProfileData()}
                    isLoading={isSaving}
                    onClick={this.updateProfile}>
                    Save
                  </Button>
                </div>
                <hr />
              </Fragment>
          }
          <h4>Interface</h4>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={filterButtonHide !== 'false'}
                onChange={this.handleToggleFilterButton}
                type="checkbox" />
              &nbsp;&nbsp;Hide filter button
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={uiThemeHide !== 'false'}
                onChange={this.handleToggleUITheme}
                type="checkbox" />
              &nbsp;&nbsp;Hide dark-mode switch in footer
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={nsfwModeHide !== 'false'}
                onChange={this.handleToggleNSFWMode}
                type="checkbox" />
              &nbsp;&nbsp;Hide nsfw-mode switch in footer
            </Label>
          </FormGroup>
          <hr />
          {
            user && user.id &&
            <Fragment>
              <h4>My Data</h4>
              <Button
                className='settings__download'
                isLoading={isDownloading}
                onClick={this.downloadUserData}>
                <FontAwesomeIcon icon='download' />&nbsp;&nbsp;Download Backup
              </Button>
              <hr />
            </Fragment>
          }
          {
            !user || !user.id &&
            <Fragment>
              {membershipStatusHeader}
              {premiumMembershipNode}
            </Fragment>
          }
          {
            user && user.id &&
            <Fragment>
              {
                (user.membershipExpiration
                  && isBeforeDate(user.membershipExpiration)) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-active'>Premium</p>
                  <p>Ends: {new Date(user.membershipExpiration).toLocaleString()}</p>
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
              {
                (!user.membershipExpiration
                  && user.freeTrialExpiration
                  && isBeforeDate(user.freeTrialExpiration)) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-active'>Premium (Free Trial)</p>
                  <p>Ends: {new Date(user.freeTrialExpiration).toLocaleString()}</p>
                  {premiumMembershipNode}
                  {checkoutBtn()}
                  <hr />
                </Fragment>
              }
              {
                (!user.membershipExpiration
                  && user.freeTrialExpiration
                  && !isBeforeDate(user.freeTrialExpiration)) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-expired'>Expired</p>
                  <p>Ended: {new Date(user.freeTrialExpiration).toLocaleString()}</p>
                  <p>Your free trial has ended. Please renew to continue using premium features.</p>
                  {premiumMembershipNode}
                  {checkoutBtn()}
                  <hr />
                </Fragment>
              }
              {
                (user.freeTrialExpiration && user.membershipExpiration
                  && !isBeforeDate(user.freeTrialExpiration)
                  && !isBeforeDate(user.membershipExpiration)) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-expired'>Expired</p>
                  <p>Ended: {new Date(user.membershipExpiration).toLocaleString()}</p>
                  <p>Your membership has expired. Please renew to continue using premium features.</p>
                  {premiumMembershipNode}
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
              {
                (user.id && !user.freeTrialExpiration && !user.membershipExpiration) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-expired'>Inactive</p>
                  <p>Your membership is inactive. Please renew to continue using premium features.</p>
                  {premiumMembershipNode}
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
            </Fragment>
          }
          {
            user && user.id &&
              <Fragment>
                <h4>Management</h4>
                <Button
                  className='settings__delete-account'
                  color='danger'
                  onClick={() => this.toggleDeleteAccountModal(true)}>
                  <FontAwesomeIcon icon='trash' />&nbsp;&nbsp;Delete Account
                </Button>
                <DeleteAccountModal 
                  email={email}
                  handleHideModal={() => this.toggleDeleteAccountModal(false)}
                  id={user.id}
                  isOpen={isDeleteAccountOpen} />
              </Fragment>
          }
          <CheckoutModal
            handleHideModal={() => this.toggleCheckoutModal(false)}
            isOpen={isCheckoutOpen} />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsSignUpShow: bindActionCreators(modalsSignUpShow, dispatch),
  settingsHideFilterButton: bindActionCreators(settingsHideFilterButton, dispatch),
  settingsHideNSFWMode: bindActionCreators(settingsHideNSFWMode, dispatch),
  settingsHideUITheme: bindActionCreators(settingsHideUITheme, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
