import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { deleteCookie, getCookie } from '~/lib/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoginModal, Navbar } from 'podverse-ui'
import { modalsLoginIsLoading, modalsLoginShow, userSetIsLoggedIn } from '~/redux/actions'
import { login } from '~/services/auth'

type Props = {
  modals?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  user?: any
  userSetIsLoggedIn?: any
}

type State = {}

class PVNavBar extends Component<Props, State> {

  constructor (props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
  }

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
        onClick: () => { 
          deleteCookie('Authentication')
          const authCookie = getCookie('Authentication')
          userSetIsLoggedIn(!!authCookie)
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

  async handleLogin (email, password) {
    const { modalsLoginIsLoading, modalsLoginShow, userSetIsLoggedIn } = this.props
    modalsLoginIsLoading(true)
    
    try {
      await login(email, password)
      userSetIsLoggedIn(true)
      modalsLoginShow(false)
    } catch {
      userSetIsLoggedIn(false)
    } finally {
      modalsLoginIsLoading(false)
    }
  }

  render () {
    const { modals, modalsLoginShow, user } = this.props
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
        <LoginModal
          handleLogin={this.handleLogin}
          hideModal={() => modalsLoginShow(false)}
          isLoading={modals.login && modals.login.isLoading}
          isOpen={modals.login && modals.login.isOpen} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginIsLoading: bindActionCreators(modalsLoginIsLoading, dispatch),
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  userSetIsLoggedIn: bindActionCreators(userSetIsLoggedIn, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
