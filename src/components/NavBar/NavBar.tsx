import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoginModal, Navbar } from 'podverse-ui'
import { modalsHideLogin, modalsShowLogin } from '~/redux/actions';
import { login } from '~/services/auth'

type Props = {
  modals?: any
  modalsHideLogin?: any
  modalsShowLogin?: any
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
    return [
      {
        as: '/settings',
        href: '/settings',
        label: 'Settings'
      },
      {
        href: '#',
        label: 'Log out'
      },
      {
        label: 'Log in',
        onClick: () => { this.props.modalsShowLogin() }
      }
    ]
  }

  handleLogin (email, password) {
    login(email, password)
  }

  render () {
    const { modals, modalsHideLogin } = this.props
    const { showLogin } = modals

    const dropdownText = (<FontAwesomeIcon icon='user-circle'></FontAwesomeIcon>)
  
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
          hideModal={modalsHideLogin}
          isOpen={showLogin} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsHideLogin: bindActionCreators(modalsHideLogin, dispatch),
  modalsShowLogin: bindActionCreators(modalsShowLogin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
