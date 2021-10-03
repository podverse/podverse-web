import ClipboardJS from 'clipboard'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, FormFeedback, FormGroup, FormText, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import CheckoutModal from '~/components/CheckoutModal/CheckoutModal'
import DeleteAccountModal from '~/components/DeleteAccountModal/DeleteAccountModal'
import PV from '~/lib/constants'
import { opmlExport } from '~/lib/opmlExport';
import { alertPremiumRequired, alertRateLimitError, alertSomethingWentWrong, convertToYYYYMMDDHHMMSS,
  isBeforeDate, validateEmail, safeAlert, setCookie } from '~/lib/utility'
import { modalsSignUpShow, pageIsLoading, settingsCensorNSFWText,
  settingsHidePlaybackSpeedButton, settingsSetDefaultHomepageTab,
  userSetInfo } from '~/redux/actions'
import { downloadLoggedInUserData, getPodcastsByQuery, updateLoggedInUser } from '~/services'
import config from '~/config'
import { i18n, withTranslation } from '~/../i18n'
const { PUBLIC_BASE_URL } = config()
const fileDownload = require('js-file-download')

type Props = {
  lastScrollPosition?: number
  modalsSignUpShow?: any
  pageKey?: string
  settings?: any
  settingsCensorNSFWText?: any
  settingsHidePlaybackSpeedButton?: any
  settingsSetDefaultHomepageTab?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {
  defaultHomepageTab?: string
  email?: string
  emailError?: string
  isCheckoutOpen?: boolean
  isDeleteAccountOpen?: boolean
  isDeleting?: boolean
  isDownloading?: boolean
  isDownloadingOPML?: boolean
  isPublic?: boolean
  isSaving?: boolean
  language: string
  name?: string
  wasCopied?: boolean
}

class Settings extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages } = state
    const currentPage = pages[PV.pageKeys.settings] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, namespacesRequired, pageKey: PV.pageKeys.settings }
  }
  constructor(props) {
    super(props)
    const { user } = props

    this.state = {
      ...(user.email ? { email: user.email } : {}),
      isDownloading: false,
      ...(user.isPublic || user.isPublic === false ? {isPublic: user.isPublic} : {}),
      language: i18n.language,
      ...(user.name ? {name: user.name} : {})
    }
  }

  componentDidMount() {
    new ClipboardJS('#settings-privacy-profile-link .btn')
  }

  profileLinkHref = () => {
    const { user } = this.props
    return `${PUBLIC_BASE_URL}${PV.paths.web.profile}/${user.id}`
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
    const { t, user } = this.props

    try {
      const userData = await downloadLoggedInUserData(user.id)
      fileDownload(JSON.stringify(userData.data), `podverse-${convertToYYYYMMDDHHMMSS()}`)
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        safeAlert(t('errorMessages:alerts.somethingWentWrong'))
      }
      console.log(error)
    }

    this.setState({ isDownloading: false })
  }

  downloadLoggedInOPMLData = async () => {
    this.setState({ isDownloadingOPML: true })
    const { t, user } = this.props
    const { subscribedPodcastIds } = user

    const query = {
      subscribedPodcastIds,
      sort: 'alphabetical',
      maxResults: true
    }

    try {
      const queryDataResult = await getPodcastsByQuery(query)
      const subscribedPodcasts = queryDataResult.data[0]
      const blob = opmlExport(subscribedPodcasts)
      fileDownload(blob, 'podverse.opml')
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        safeAlert(t('errorMessages:alerts.somethingWentWrong'))
      }
      console.log(error)
    }
    this.setState({ isDownloadingOPML: false })
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

  handleLanguageChange = event => {
    const language = event.target.value
    this.setState({ language }, () => {
      i18n.changeLanguage(language)
    })
  }

  handleDefaultHomepageTabChange = event => {
    const { settingsSetDefaultHomepageTab } = this.props
    const defaultHomepageTab = event.target.value
    setCookie(PV.cookies.defaultHomepageTab, defaultHomepageTab)
    settingsSetDefaultHomepageTab(defaultHomepageTab)
  }

  handleToggleCensorNSFWText = event => {
    const { settingsCensorNSFWText } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false
    setCookie(PV.cookies.censorNSFWText, val)
    settingsCensorNSFWText(val)
  }

  handleTogglePlaybackSpeedButton = event => {
    const { settingsHidePlaybackSpeedButton } = this.props
    const isChecked = event.currentTarget.checked
    const val = isChecked ? true : false
    setCookie(PV.cookies.playbackSpeedButtonHide, val)
    settingsHidePlaybackSpeedButton(val)
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
    const { t } = this.props
    const { email } = this.state
    if (!validateEmail(email)) {
      this.setState({ emailError: t('errorMessages:message.PleaseProvideValidEmail') })
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
    const { t, user, userSetInfo } = this.props
    const { id } = user
    const { email, isPublic, name } = this.state

    try {
      const newData = { email, id, isPublic, name }
      await updateLoggedInUser(newData)
      userSetInfo(newData)
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === t('PremiumMembershipRequired')) {
        alertPremiumRequired(t)
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong(t)
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
    const { settings, t, user } = this.props
    const meta = {
      currentUrl: PUBLIC_BASE_URL + PV.paths.web.settings,
      description: t('pages:settings._Description'),
      title: t('pages:settings._Title')
    }
    const { censorNSFWText, defaultHomepageTab, playbackSpeedButtonHide } = settings
    const { email, emailError, isCheckoutOpen, isDeleteAccountOpen, isDownloading, isDownloadingOPML,
      isPublic, isSaving, language, name, wasCopied } = this.state
    const isLoggedIn = user && !!user.id

    const checkoutBtn = (isRenew = false) => (
      <Button
        className='settings-membership__checkout'
        color='primary'
        onClick={() => this.toggleCheckoutModal(true)}>
        <FontAwesomeIcon icon='shopping-cart' />&nbsp;&nbsp;{isRenew ? t('Renew') : t('Checkout')}
      </Button>
    )

    const membershipStatusHeader = <h3 id='membership'>{t('MembershipStatus')}</h3>

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
        <h3>{t('Settings')}</h3>
        <Form>
          {
            isLoggedIn &&
            <Fragment>
                <FormGroup>
                  <Label for='settings-name'>{t('Name')}</Label>
                  <Input 
                    id='settings-name'
                    name='settings-name'
                    onChange={this.handleNameChange}
                    placeholder='anonymous'
                    type='text'
                    value={name} />
                  <FormText>{t('MayAppearNextToContentYouCreate')}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for='settings-name'>{t('Email')}</Label>
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
                  <Label for='settings-privacy'>{t('Profile Privacy')}</Label>
                  <Input
                    className='settings-privacy settings-dropdown'
                    name='settings-privacy'
                    onChange={this.handlePrivacyChange}
                    type='select'
                    value={isPublic ? 'public' : 'private'}>
                    <option value='public'>{t('Public')}</option>
                    <option value='private'>{t('Private')}</option>
                  </Input>
                  {
                    isPublic ?
                      <FormText>{t('Podcasts, clips, and playlists are visible on your profile page')}</FormText>
                      : <FormText>{t('Your profile page is hidden')}</FormText>
                  }
                </FormGroup>
                {
                  (user.isPublic && isPublic) &&
                    <FormGroup style={{marginBottom: '2rem'}}>
                      <Label for='settings-privacy-profile-link'>{t('SharableProfileLink')}</Label>
                      <InputGroup id='settings-privacy-profile-link'>
                        <Input
                          id='settings-privacy-profile-link-input'
                          readOnly={true}
                          value={`${PUBLIC_BASE_URL}/profile/${user.id}`} />
                        <InputGroupAddon
                          addonType='append'>
                          <Button
                            color='primary'
                            dataclipboardtarget='#settings-privacy-profile-link-input'
                            onClick={this.copyProfileLink}
                            text={wasCopied ? t('Copied!') : t('Copy')} />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                }
                <div className='settings-profile__btns'>
                  <Button
                    className='settings-profile-btns__cancel'
                    onClick={this.resetProfileChanges}>
                    {t('Cancel')}
                  </Button>
                  <Button
                    className='settings-profile-btns__save'
                    color='primary'
                    disabled={!this.validateProfileData()}
                    isLoading={isSaving}
                    onClick={this.updateProfile}>
                    {t('Save')}
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
                  <p className='settings-membership__status is-active'>{t('Premium')}</p>
                  <p>{t('Ends')}{new Date(user.membershipExpiration).toLocaleString()}</p>
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
                  <p className='settings-membership__status is-active'>{t('PremiumFreeTrial')}</p>
                <p>{t('Ends')}{new Date(user.freeTrialExpiration).toLocaleString()}</p>
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
                <p className='settings-membership__status is-expired'>{t('Expired')}</p>
                  <p>{t('Ended')}{new Date(user.freeTrialExpiration).toLocaleString()}</p>
                  <p>{t('TrialEnded')}</p>
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
                  <p className='settings-membership__status is-expired'>{t('Expired')}</p>
                  <p>{t('Ended')}{new Date(user.membershipExpiration).toLocaleString()}</p>
                  <p>{t('MembershipEnded')}</p>
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
              {
                (user.id && !user.freeTrialExpiration && !user.membershipExpiration) &&
                <Fragment>
                  {membershipStatusHeader}
                  <p className='settings-membership__status is-expired'>{t('Inactive')}</p>
                  <p>{t('MembershipInactive')}</p>
                  {checkoutBtn(true)}
                  <hr />
                </Fragment>
              }
            </Fragment>
          }
          <h4>{t('Interface')}</h4>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={censorNSFWText === 'true' || censorNSFWText === true}
                onChange={this.handleToggleCensorNSFWText}
                type="checkbox" />
              &nbsp;&nbsp;{t('Censor NSFW Text')}
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label className='checkbox-label' check>
              <Input
                checked={playbackSpeedButtonHide === 'true' || playbackSpeedButtonHide === true}
                onChange={this.handleTogglePlaybackSpeedButton}
                type="checkbox" />
              &nbsp;&nbsp;{t('HidePlaybackSpeedButton')}
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for='settings-default-homepage-tab'>{t('Default homepage tab')}</Label>
            <Input
              className='settings-default-homepage-tab settings-dropdown'
              name='settings-default-homepage-tab'
              onChange={this.handleDefaultHomepageTabChange}
              type='select'
              value={defaultHomepageTab}>
              <option value='last-visited'>{t('Last Visited')}</option>
              <option value='podcasts'>{t('Podcasts')}</option>
              <option value='episodes'>{t('Episodes')}</option>
              <option value='clips'>{t('Clips')}</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for='settings-language'>{t('Language')}</Label>
            <Input
              className='settings-language settings-dropdown'
              name='settings-language'
              onChange={this.handleLanguageChange}
              type='select'
              value={language}>
              <option value='en'>{t('language - en')}</option>
              <option value='es'>{t('language - es')}</option>
            </Input>
          </FormGroup>
          {
            user && user.id &&
            <Fragment>
              <hr />
              <h4>{t('MyData')}</h4>
              <p>{t('Export OPML Description')}</p>
              <Button
                className='settings__download'
                isLoading={isDownloadingOPML}
                onClick={this.downloadLoggedInOPMLData}>
                <FontAwesomeIcon icon='download' />&nbsp;&nbsp;{t('Export OPML')}
              </Button>
              <hr />
              <p>
                {t('DownloadDataBackup')}
              </p>
              <Button
                className='settings__download'
                isLoading={isDownloading}
                onClick={this.downloadLoggedInUserData}>
                <FontAwesomeIcon icon='download' />&nbsp;&nbsp;{t('Download')}
              </Button>
              <hr />
            </Fragment>
          }
          {
            user && user.id &&
              <Fragment>
                <h4>{t('Management')}</h4>
                <Button
                  className='settings__delete-account'
                  color='danger'
                  onClick={() => this.toggleDeleteAccountModal(true)}>
                  <FontAwesomeIcon icon='trash' />&nbsp;&nbsp;{t('DeleteAccount')}
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
  settingsCensorNSFWText: bindActionCreators(settingsCensorNSFWText, dispatch),
  settingsHidePlaybackSpeedButton: bindActionCreators(settingsHidePlaybackSpeedButton, dispatch),
  settingsSetDefaultHomepageTab: bindActionCreators(settingsSetDefaultHomepageTab, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Settings))
