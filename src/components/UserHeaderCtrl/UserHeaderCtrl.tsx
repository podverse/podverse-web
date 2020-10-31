
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { Button, Pill } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PV from '~/lib/constants'
import { alertPremiumRequired, alertSomethingWentWrong, alertRateLimitError, safeAlert } from '~/lib/utility'
import { userSetInfo } from '~/redux/actions'
import { toggleSubscribeToUser } from '~/services'
import config from '~/config'
import { withTranslation } from 'i18n'
const { BASE_URL } = config()
const ClipboardJS = require('clipboard')

type Props = {
  loggedInUser?: any
  profileUser?: any
  t?: any
  userSetInfo?: any
}

type State = {
  isSubscribing?: boolean
  shareLinkPopoverOpen?: boolean
  wasCopied?: boolean
}

class UserHeaderCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    new ClipboardJS('#profile-link .btn')
  }

  toggleSubscribe = async () => {
    const { loggedInUser, profileUser, t, userSetInfo } = this.props

    if (!loggedInUser || !loggedInUser.id) {
      safeAlert(t('LoginToSubscribeToThisProfile'))
      return
    }

    this.setState({ isSubscribing: true })

    try {
      const response = await toggleSubscribeToUser(profileUser.id)

      if (response) {
        userSetInfo({ subscribedUserIds: response.data })
      }
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === PV.errorResponseMessages.premiumRequired) {
        alertPremiumRequired(t)
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong(t)
      }
    }

    this.setState({ isSubscribing: false })
  }

  copyProfileLink = () => {
    this.setState({ wasCopied: true })
    setTimeout(() => {
      this.setState({
        shareLinkPopoverOpen: false,
        wasCopied: false
      })
    }, 2250)
  }

  toggleShareLinkPopoverOpen = () => {
    const { shareLinkPopoverOpen } = this.state
    this.setState({ shareLinkPopoverOpen: !shareLinkPopoverOpen }, () => {
      new ClipboardJS('#clip-created-copy-link .btn')
    })
  }

  render() {
    const { loggedInUser, profileUser, t } = this.props
    const { isSubscribing, shareLinkPopoverOpen, wasCopied } = this.state
    const { subscribedUserIds } = loggedInUser
    const isSubscribed = subscribedUserIds && subscribedUserIds.includes(profileUser.id)

    return (
      <div className='media-header'>
        <div className='text-wrapper'>
          <div className='media-header__top'>
            <div className='media-header__title'>
              {profileUser.name ? profileUser.name : t('Anonymous')}
            </div>
            <div className='media-header-top__buttons'>
              {
                loggedInUser && profileUser && loggedInUser.id === profileUser.id ?
                  <React.Fragment>
                    {
                      loggedInUser.isPublic &&
                        <React.Fragment>
                          <a
                            className='media-header__link'
                            id='profileShareLink'
                            onClick={this.toggleShareLinkPopoverOpen}>
                            <FontAwesomeIcon icon='link' />
                          </a>
                          <Popover
                            className='media-header__link-popover'
                            isOpen={shareLinkPopoverOpen}
                            placement='bottom'
                            target='profileShareLink'>
                            <PopoverHeader>
                              {t('CopyLinkToProfile')}
                            </PopoverHeader>
                            <PopoverBody>
                              <InputGroup id='profile-link'>
                                <Input
                                  id='profile-link-input'
                                  readOnly={true}
                                  value={`${BASE_URL}/profile/${loggedInUser.id}`} />
                                <InputGroupAddon
                                  addonType='append'>
                                  <Button
                                    color='primary'
                                    dataclipboardtarget='#profile-link-input'
                                    onClick={this.copyProfileLink}
                                    text={wasCopied ? 'Copied!' : 'Copy'} />
                                </InputGroupAddon>
                              </InputGroup>
                            </PopoverBody>
                          </Popover>
                        </React.Fragment>
                    }
                    {
                      loggedInUser.isPublic &&
                        <a
                          className='media-header__edit'
                          href={PV.paths.web.settings}>
                          <FontAwesomeIcon icon='edit' />
                        </a>
                    }
                    <div className='media-header__privacy'>
                      {
                        loggedInUser.isPublic ?
                          <React.Fragment>
                            <FontAwesomeIcon icon='globe-americas' />
                          </React.Fragment>
                          :
                          <React.Fragment>
                            <FontAwesomeIcon icon='lock' />
                          </React.Fragment>
                      }
                    </div>
                  </React.Fragment> :
                  <Pill
                    isActive={isSubscribed}
                    isLoading={isSubscribing}
                    onClick={this.toggleSubscribe}
                    text={isSubscribed ? t('Subscribed') : t('Subscribe')}
                    title={isSubscribed ? t('Subscribed') : t('Subscribe')} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(UserHeaderCtrl))