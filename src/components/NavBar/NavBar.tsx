import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, getPriorityQueueItemsStorage } from 'podverse-ui'
import { modalsLoginShow, pageIsLoading, playerQueueLoadPriorityItems, userSetInfo
  } from '~/redux/actions'
import { logOut } from '~/services/auth'

type Props = {
  modals?: any
  modalsForgotPasswordIsLoading?: any
  modalsForgotPasswordShow?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  pageIsLoading?: any
  playerQueueLoadPriorityItems?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class PVNavBar extends Component<Props, State> {

  navItems () {
    return [
      {
        as: '/search',
        href: '/search',
        icon: 'search'
      },
      {
        as: '/podcasts',
        href: '/podcasts',
        label: 'Podcasts'
      },
      {
        as: '/playlists',
        href: '/playlists',
        label: 'Playlists'
      }
    ]
  } 

  dropdownItems () {
    const { playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { id } = user

    let dropdownItems = [
      {
        as: '/settings',
        href: '/settings',
        label: 'Settings',
        onClick: () => {}
      }
    ]

    if (!!id) {
      dropdownItems.push({
        as: '',
        href: '',
        label: 'Log out',
        onClick: async () => {
          try {
            await logOut()
            userSetInfo({
              email: '',
              freeTrialExpiration: null,
              historyItems: [],
              id: '',
              mediaRefs: [],
              membershipExpiration: null,
              name: '',
              playlists: [],
              queueItems: [],
              subscribedPlaylistIds: [],
              subscribedPodcastIds: []
            })
            playerQueueLoadPriorityItems(getPriorityQueueItemsStorage())
          } catch (error) {
            console.log(error)
          }
        }
      })
    } else {
      dropdownItems.push({
        as: '',
        href: '',
        label: 'Log in',
        onClick: () => { this.props.modalsLoginShow(true) }
      })
    }

    return dropdownItems
  }

  render () {
    const { user } = this.props
    const { id } = user 

    const dropdownText = (!!id ? <FontAwesomeIcon icon='user-circle'></FontAwesomeIcon> : null)
  
    return (
      <React.Fragment>
        <Navbar
          brandHideText={true}
          brandText='Podverse'
          brandUrl='/'
          dropdownItems={this.dropdownItems()}
          dropdownText={dropdownText}
          navItems={this.navItems()} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
