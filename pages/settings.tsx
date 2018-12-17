import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, FormFeedback, FormGroup, FormText, Label, Input } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PVButton as Button } from 'podverse-ui'
import Meta from '~/components/meta'
import CheckoutModal from '~/components/CheckoutModal/CheckoutModal'
import { DeleteAccountModal } from '~/components/DeleteAccountModal/DeleteAccountModal'
import { convertToYYYYMMDDHHMMSS, isBeforeDate, validateEmail } from '~/lib/utility'
import { modalsSignUpShow, pageIsLoading, settingsHideNSFWMode, settingsHideUITheme,
  userSetInfo } from '~/redux/actions'
import { downloadUserData, updateUser } from '~/services'
const fileDownload = require('js-file-download')
const cookie = require('cookie')

type Props = {
  modalsSignUpShow?: any
  settings?: any
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
  isSaving?: boolean
  name?: string
}

class Settings extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    return {}
  }

  constructor(props) {
    super(props)
    const { user } = props

    this.state = {
      ...(user.email ? { email: user.email } : {}),
      isDownloading: false,
      ...(user.name ? {name: user.name} : {})
    }

    this.downloadUserData = this.downloadUserData.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleToggleNSFWMode = this.handleToggleNSFWMode.bind(this)
    this.handleToggleUITheme = this.handleToggleUITheme.bind(this)
    this.resetProfileChanges = this.resetProfileChanges.bind(this)
    this.showSignUpModal = this.showSignUpModal.bind(this)
    this.toggleCheckoutModal = this.toggleCheckoutModal.bind(this)
    this.toggleDeleteAccountModal = this.toggleDeleteAccountModal.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.validateProfileData = this.validateProfileData.bind(this)
  }

  componentWillReceiveProps (newProps) {
    const oldProps = this.props
    
    if (!oldProps.user.id && newProps.user.id) {
      this.setState({
        email: newProps.user.email,
        name: newProps.user.name
      })
    }
  }

  async downloadUserData () {
    this.setState({ isDownloading: true })
    const { user } = this.props

    try {
      const userData = await downloadUserData(user.id)
      fileDownload(JSON.stringify(userData),  `podverse-${convertToYYYYMMDDHHMMSS()}`)
      
    } catch (error) {
      console.log(error)
      alert('Something went wrong. Please check your internet connection.')
    }

    this.setState({ isDownloading: false })
  }

  handleEmailChange(event) {
    const email = event.target.value
    this.setState({ email })
  }

  handleNameChange(event) {
    const name = event.target.value
    this.setState({ name })
  }

  handleToggleNSFWMode(event) {
    const { settingsHideNSFWMode } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? 'on' : 'off'

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const nsfwModeHideCookie = cookie.serialize('nsfwModeHide', val, {
      expires,
      path: '/'
    })
    document.cookie = nsfwModeHideCookie
        
    settingsHideNSFWMode(val)
  }

  handleToggleUITheme(event) {
    const { settingsHideUITheme } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? 'on' : 'off'

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const uiThemeHideCookie = cookie.serialize('uiThemeHide', val, {
      expires,
      path: '/'
    })
    document.cookie = uiThemeHideCookie

    settingsHideUITheme(val)
  }

  validateProfileData() {
    const { user } = this.props
    const { email: oldEmail, name: oldName } = user
    const { email: newEmail, name: newName } = this.state

    return (
      (oldEmail !== newEmail && validateEmail(newEmail))
      || oldName !== newName && (!newEmail || validateEmail(newEmail))
    )
  }

  validateEmail() {
    const { email } = this.state
    if (!validateEmail(email)) {
      this.setState({ emailError: 'Please provide a valid email address' })
    } else {
      this.setState({ emailError: '' })
    }
  }

  resetProfileChanges() {
    const { user } = this.props
    const { email, name } = user
    this.setState({ email, name })
  }

  async updateProfile() {
    this.setState({ isSaving: true })
    const { user, userSetInfo } = this.props
    const { id } = user
    const { email, name } = this.state

    try {
      const newData = { email, id, name }
      await updateUser(newData)
      userSetInfo(newData)
    } catch (error) {
      console.log(error)
      alert('Something went wrong. Please check your internet connection.')
    }

    this.setState({ isSaving: false })
  }

  showSignUpModal () {
    const { modalsSignUpShow } = this.props
    modalsSignUpShow(true)
  }

  toggleCheckoutModal (show) {
    this.setState({ isCheckoutOpen: show })
  }
  
  toggleDeleteAccountModal (show) {
    this.setState({ isDeleteAccountOpen: show })
  }
  
  render() {
    const { settings, user } = this.props
    const { nsfwModeHide, uiThemeHide } = settings
    const { email, emailError, isCheckoutOpen, isDeleteAccountOpen, isDownloading,
      isSaving, name } = this.state
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
          <li>Sync your podcast list on all devices</li>
          <li>Sync your queue on all devices</li>
          <li>Support open source software and user data rights</li>
        </ul>
        <p>$3 per year, checkout with PayPal or crypto</p>
        <div className='settings-membership__btns'>
          {
            user && user.id &&
              checkoutBtn
          }
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
        <Meta />
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
                checked={uiThemeHide === 'on'}
                onChange={this.handleToggleUITheme}
                type="checkbox" />
              &nbsp;&nbsp;Hide dark-mode switch in footer
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={nsfwModeHide === 'on'}
                onChange={this.handleToggleNSFWMode}
                type="checkbox" />
              &nbsp;&nbsp;Hide nsfw-mode switch in footer
            </Label>
          </FormGroup>
          <hr />
          {
            user && user.id &&
            <Fragment>
              <h4>User Data</h4>
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
  settingsHideNSFWMode: bindActionCreators(settingsHideNSFWMode, dispatch),
  settingsHideUITheme: bindActionCreators(settingsHideUITheme, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)