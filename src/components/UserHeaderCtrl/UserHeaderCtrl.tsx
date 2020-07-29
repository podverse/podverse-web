
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { Button } from 'podverse-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import PV from '~/lib/constants'
import { alertPremiumRequired, alertSomethingWentWrong, alertRateLimitError, safeAlert } from '~/lib/utility'
import { userSetInfo } from '~/redux/actions'
import { toggleSubscribeToUser } from '~/services'
import config from '~/config'
const { BASE_URL } = config()
const ClipboardJS = require('clipboard')

type Props = {
  loggedInUser?: any
  profileUser?: any
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
    const { loggedInUser, profileUser, userSetInfo } = this.props

    if (!loggedInUser || !loggedInUser.id) {
      safeAlert(PV.errorMessages.login.SubscribeToProfile)
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
        alertPremiumRequired()
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong()
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
    const { loggedInUser, profileUser } = this.props
    const { isSubscribing, shareLinkPopoverOpen, wasCopied } = this.state
    const { subscribedUserIds } = loggedInUser
    const isSubscribed = subscribedUserIds && subscribedUserIds.includes(profileUser.id)

    return (
      <div className='media-header'>
        <div className='text-wrapper'>
          <div className='media-header__top'>
            <div className='media-header__title'>
              {profileUser.name ? profileUser.name : PV.core.anonymous}
            </div>
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
                            {PV.core.CopyLinkToProfile}
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
                  <div className='media-header__subscribe'>
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
                  <button
                    className='media-header__subscribe'
                    onClick={this.toggleSubscribe}>
                    {
                      isSubscribing ?
                        <FontAwesomeIcon icon='spinner' spin />
                        :
                        <React.Fragment>
                          {
                            isSubscribed ?
                              <FontAwesomeIcon icon={fasStar} />
                              : <FontAwesomeIcon icon={farStar} />
                          }
                        </React.Fragment>
                    }
                  </button>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(UserHeaderCtrl)