
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { alertPremiumRequired, alertSomethingWentWrong } from '~/lib/utility'
import { userSetInfo } from '~/redux/actions'
import { toggleSubscribeToUser } from '~/services'

type Props = {
  loggedInUser?: any
  profileUser?: any
  userSetInfo?: any
}

type State = {
  isSubscribing?: boolean
}

class UserHeaderCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  constructor(props) {
    super(props)

    this.state = {}

    this.toggleSubscribe = this.toggleSubscribe.bind(this)
  }

  async toggleSubscribe() {
    const { loggedInUser, profileUser, userSetInfo } = this.props

    if (!loggedInUser || !loggedInUser.id) {
      alert('Login to subscribe to this profile.')
      return
    }

    this.setState({ isSubscribing: true })

    try {
      const response = await toggleSubscribeToUser(profileUser.id)

      if (response) {
        userSetInfo({ subscribedUserIds: response.data })
      }
    } catch (error) {
      if (error.response.data === 'Premium Membership Required') {
        alertPremiumRequired()
      } else {
        alertSomethingWentWrong()
      }
    }

    this.setState({ isSubscribing: false })
  }

  render() {
    const { loggedInUser, profileUser } = this.props
    const { isSubscribing } = this.state
    const { subscribedUserIds } = loggedInUser
    const isSubscribed = subscribedUserIds && subscribedUserIds.includes(profileUser.id)

    return (
      <div className='media-header'>
        <div className='text-wrapper'>
          <div className='media-header__top'>
            <div className='media-header__title'>
              {profileUser.name ? profileUser.name : 'anonymous'}
            </div>
            {
              loggedInUser && profileUser && loggedInUser.id === profileUser.id ?
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
                </div> :
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
                            // @ts-ignore
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