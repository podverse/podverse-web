import ClipboardJS from 'clipboard'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, FormFeedback, FormGroup, FormText, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import CheckoutModal from '~/components/CheckoutModal/CheckoutModal'
import { DeleteAccountModal } from '~/components/DeleteAccountModal/DeleteAccountModal'
import { alertPremiumRequired, alertRateLimitError, alertSomethingWentWrong, convertToYYYYMMDDHHMMSS,
  isBeforeDate, validateEmail, safeAlert } from '~/lib/utility'
import { modalsSignUpShow, pageIsLoading, settingsHideFilterButton, settingsHideNSFWLabels,
  settingsHideNSFWMode, settingsHidePlaybackSpeedButton, settingsHideTimeJumpBackwardButton,
  settingsHideUITheme, userSetInfo } from '~/redux/actions'
import { downloadLoggedInUserData, updateLoggedInUser } from '~/services'
import config from '~/config'
const { BASE_URL } = config()
const fileDownload = require('js-file-download')
const cookie = require('cookie')

type Props = {
  lastScrollPosition?: number
  meta?: any
  modalsSignUpShow?: any
  pageKey?: string
  settings?: any
  settingsHideFilterButton?: any
  settingsHideNSFWMode?: any
  settingsHideTimeJumpBackwardButton?: any
  settingsHidePlaybackSpeedButton?: any
  settingsHideNSFWLabels?: any
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

const kPageKey = 'settings'

class Settings extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: BASE_URL + '/settings',
      description: 'Customize your account settings on Podverse.',
      title: `Podverse - Settings`
    }

    return { lastScrollPosition, meta, pageKey: kPageKey }
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

  componentDidMount() {
    new ClipboardJS('#settings-privacy-profile-link .btn')
  }

  profileLinkHref = () => {
    const { user } = this.props
    return `${BASE_URL}/profile/${user.id}`
  }

  copyProfileLink = () => {
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

  downloadLoggedInUserData = async () => {
    this.setState({ isDownloading: true })
    const { user } = this.props

    try {
      const userData = await downloadLoggedInUserData(user.id)
      fileDownload(JSON.stringify(userData.data), `podverse-${convertToYYYYMMDDHHMMSS()}`)
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        safeAlert('Something went wrong. Please check your internet connection.')
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
    this.setState({ isPublic: isPublic === 'public' }, () => {
      // If the share button should have appeared, apply the Clipboard event listener
      if (isPublic === 'public') {
        new ClipboardJS('#settings-privacy-profile-link .btn')
      }
    })
  }

  handleToggleFilterButton = event => {
    const { settingsHideFilterButton } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const c = cookie.serialize('filterButtonHide', val, {
      expires,
      path: '/'
    })
    document.cookie = c

    settingsHideFilterButton(`${val}`)
  }

  handleToggleNSFWLabels = event => {
    const { settingsHideNSFWLabels } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const c = cookie.serialize('nsfwLabelsHide', val, {
      expires,
      path: '/'
    })
    document.cookie = c

    settingsHideNSFWLabels(`${val}`)
  }

  handleToggleNSFWMode = event => {
    const { settingsHideNSFWMode } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const c = cookie.serialize('nsfwModeHide', val, {
      expires,
      path: '/'
    })
    document.cookie = c
        
    settingsHideNSFWMode(`${val}`)
  }

  handleTogglePlaybackSpeedButton = event => {
    const { settingsHidePlaybackSpeedButton } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const c = cookie.serialize('playbackSpeedButtonHide', val, {
      expires,
      path: '/'
    })
    document.cookie = c

    settingsHidePlaybackSpeedButton(`${val}`)
  }

  handleToggleTimeJumpBackwardButton = event => {
    const { settingsHideTimeJumpBackwardButton } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const c = cookie.serialize('timeJumpBackwardButtonHide', val, {
      expires,
      path: '/'
    })
    document.cookie = c

    settingsHideTimeJumpBackwardButton(`${val}`)
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
      await updateLoggedInUser(newData)
      userSetInfo(newData)
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === 'Premium Membership Required') {
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
    const { filterButtonHide, nsfwLabelsHide, playbackSpeedButtonHide,
      timeJumpBackwardButtonHide, uiThemeHide } = settings
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

    const membershipStatusHeader = <h3 id='membership'>Membership Status</h3>

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
                      <FormText>Podcasts, clips, and playlists are visible on your profile page</FormText>
                      : <FormText>Your profile page is hidden. Your Public clips are still accessible by anyone,
                        and your Only with Link clips and playlists are still accessible to anyone with the URL.</FormText>
                  }
                </FormGroup>
                {
                  (user.isPublic && isPublic) &&
                    <FormGroup style={{marginBottom: '2rem'}}>
                      <Label for='settings-privacy-profile-link'>Sharable Profile Link</Label>
                      <InputGroup id='settings-privacy-profile-link'>
                        <Input
                          id='settings-privacy-profile-link-input'
                          readOnly={true}
                          value={`${BASE_URL}/profile/${user.id}`} />
                        <InputGroupAddon
                          addonType='append'>
                          <Button
                            color='primary'
                            dataclipboardtarget='#settings-privacy-profile-link-input'
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
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
            </Fragment>
          }
          <h3>Interface</h3>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={timeJumpBackwardButtonHide === 'true'}
                onChange={this.handleToggleTimeJumpBackwardButton}
                type="checkbox" />
              &nbsp;&nbsp;Hide jump backwards button
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={playbackSpeedButtonHide === 'true'}
                onChange={this.handleTogglePlaybackSpeedButton}
                type="checkbox" />
              &nbsp;&nbsp;Hide playback speed button
            </Label>
          </FormGroup>    
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={filterButtonHide === 'true'}
                onChange={this.handleToggleFilterButton}
                type="checkbox" />
              &nbsp;&nbsp;Hide filter buttons
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={uiThemeHide !== 'false' && !!uiThemeHide}
                onChange={this.handleToggleUITheme}
                type="checkbox" />
              &nbsp;&nbsp;Hide Dark mode switch in footer
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={nsfwLabelsHide === 'true' || !nsfwLabelsHide}
                onChange={this.handleToggleNSFWLabels}
                type="checkbox" />
              &nbsp;&nbsp;Hide NSFW Labels
            </Label>
          </FormGroup>
          {
            user && user.id &&
            <Fragment>
              <hr />
              <h3>My Data</h3>
              <p>
                Download a backup of your data.
              </p>
              <Button
                className='settings__download'
                isLoading={isDownloading}
                onClick={this.downloadLoggedInUserData}>
                <FontAwesomeIcon icon='download' />&nbsp;&nbsp;Download
              </Button>
              <hr />
            </Fragment>
          }
          {
            user && user.id &&
              <Fragment>
                <h3>Management</h3>
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
  settingsHideNSFWLabels: bindActionCreators(settingsHideNSFWLabels, dispatch),
  settingsHideNSFWMode: bindActionCreators(settingsHideNSFWMode, dispatch),
  settingsHidePlaybackSpeedButton: bindActionCreators(settingsHidePlaybackSpeedButton, dispatch),
  settingsHideTimeJumpBackwardButton: bindActionCreators(settingsHideTimeJumpBackwardButton, dispatch),
  settingsHideUITheme: bindActionCreators(settingsHideUITheme, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
