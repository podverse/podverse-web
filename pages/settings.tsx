import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, FormGroup, FormText, Label, Input } from 'reactstrap'
import { PVButton as Button } from 'podverse-ui'
import Meta from '~/components/meta'
import { pageIsLoading, settingsHideNSFWMode, settingsHideUITheme
  } from '~/redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bindActionCreators } from 'redux';
const cookie = require('cookie')

type Props = {
  settings?: any
  settingsHideNSFWMode?: any
  settingsHideUITheme?: any
  user?: any
}

type State = {
  isDeleting?: boolean
  isDownloading?: boolean
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
      isDownloading: false,
      ...(user.name ? {name: user.name} : {})
    }

    this.deleteAccount = this.deleteAccount.bind(this)
    this.downloadUserData = this.downloadUserData.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleToggleNSFWMode = this.handleToggleNSFWMode.bind(this)
    this.handleToggleUITheme = this.handleToggleUITheme.bind(this)
  }

  deleteAccount () {
    this.setState({ isDeleting: true })
  }

  downloadUserData () {
    this.setState({ isDownloading: true })
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
  
  render() {
    const { settings } = this.props
    const { nsfwModeHide, uiThemeHide } = settings
    const { isDeleting, isDownloading, name } = this.state

    return (
      <div className='settings'>
        <Meta />
        <h3>Settings</h3>
        <Form>
          <FormGroup>
            <Label for='settings-name'>Name</Label>
            <Input 
              id='settings-name'
              name='settings-name'
              onChange={this.handleNameChange}
              placeholder='anonymous'
              type='text'
              value={name} />
            <FormText>Appears next to your playlists</FormText>
            <FormGroup check>
              <Label className='checkbox-label' check>
                <Input
                  checked={uiThemeHide === 'on'}
                  onChange={this.handleToggleUITheme}
                  type="checkbox" />
                &nbsp;&nbsp;Hide dark-mode switch in footer
              </Label>
              <Label className='checkbox-label' check>
                <Input
                  checked={nsfwModeHide === 'on'}
                  onChange={this.handleToggleNSFWMode}
                  type="checkbox" />
                &nbsp;&nbsp;Hide nsfw-mode switch in footer
              </Label>
              <div className='clearfix' />
            </FormGroup>
            <div className='settings__btns'>
              <Button
                className='settings__download'
                isLoading={isDownloading}
                onClick={this.downloadUserData}>
                <FontAwesomeIcon icon='download' />&nbsp;&nbsp;Download
              </Button>
              <Button
                className='settings__delete-account'
                color='danger'
                isLoading={isDeleting}
                onClick={this.deleteAccount}>
                <FontAwesomeIcon icon='trash' />&nbsp;&nbsp;Delete Account
              </Button>
            </div>
          </FormGroup>
        </Form>
        <hr />
        <h4>Premium Membership</h4>
        <ul>
          <li>Sync your podcasts and queue across all devices</li>
          <li>Create and share playlists of episodes and clips</li>
          <li>Automatically save your clips to a playlist</li>
          <li>Download a backup of your Podverse data</li>
          <li>Support open source software and user data rights</li>
        </ul>
        <p>$3 per year, checkout with PayPal or crypto</p>
        <Button
          className='settings__sign-up-premium'
          color='primary'
          onClick={this.deleteAccount}>
          <FontAwesomeIcon icon='headphones' />&nbsp;&nbsp;Go Premium
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  settingsHideNSFWMode: bindActionCreators(settingsHideNSFWMode, dispatch),
  settingsHideUITheme: bindActionCreators(settingsHideUITheme, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)