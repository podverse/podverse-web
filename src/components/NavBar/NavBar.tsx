import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar } from 'podverse-ui'
import { modalsLoginShow, userSetIsLoggedIn } from '~/redux/actions'
import { logOut } from '~/services/auth'

type Props = {
  modals?: any
  modalsForgotPasswordIsLoading?: any
  modalsForgotPasswordShow?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  user?: any
  userSetIsLoggedIn?: any
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
    const { user, userSetIsLoggedIn } = this.props
    const { isLoggedIn } = user

    let dropdownItems = [
      {
        as: '/settings',
        href: '/settings',
        label: 'Settings',
        onClick: () => {}
      }
    ]

    if (isLoggedIn) {
      dropdownItems.push({
        as: '',
        href: '',
        label: 'Log out',
        onClick: async () => {
          try {
            await logOut()
            userSetIsLoggedIn(false)
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
    const { isLoggedIn } = user

    const dropdownText = (isLoggedIn ? <FontAwesomeIcon icon='user-circle'></FontAwesomeIcon> : null)
  
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
  userSetIsLoggedIn: bindActionCreators(userSetIsLoggedIn, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
