import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, getPriorityQueueItemsStorage } from 'podverse-ui'
import { modalsLoginShow, pageIsLoading, pagesSetQueryState,
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { logOut } from '~/services/auth'

type Props = {
  modals?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  pageIsLoading?: any
  pageKey?: string
  playerQueueLoadPriorityItems?: any
  settings?: any
  user?: any
  userSetInfo?: any
}

type State = {
  dropdownMenuIsOpen?: boolean
  mobileMenuIsOpen?: boolean
}

class PVNavBar extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  navItems () {
    return [
      {
        as: '/search',
        href: '/search',
        icon: 'search',
        onClick: () => { this.linkClick() }
      },
      {
        as: '/podcasts',
        href: '/podcasts',
        label: 'Podcasts',
        onClick: () => { this.linkClick() }
      },
      {
        as: '/playlists',
        href: '/playlists',
        label: 'Playlists',
        onClick: () => { this.linkClick() }
      }
    ]
  } 

  dropdownItems () {
    const { playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { id } = user

    let dropdownItems = []

    if (!!id) {
      dropdownItems.push({
        as: '/profiles',
        href: '/profiles',
        label: 'Profiles',
        onClick: () => { this.linkClick() }
      })
      dropdownItems.push({
        as: '/my-profile',
        href: '/my-profile',
        label: 'My Profile',
        onClick: () => { this.linkClick() }
      })
    }

    dropdownItems.push({
      as: '/settings',
      href: '/settings',
      label: 'Settings',
      onClick: () => { this.linkClick() }
    })
    
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
              emailVerified: null,
              freeTrialExpiration: null,
              historyItems: [],
              id: '',
              isPublic: null,
              mediaRefs: [],
              membershipExpiration: null,
              name: '',
              playlists: [],
              queueItems: [],
              subscribedPlaylistIds: [],
              subscribedPodcastIds: [],
              subscribedUserIds: []
            })
            playerQueueLoadPriorityItems(getPriorityQueueItemsStorage())
            window.location.reload()
          } catch (error) {
            console.log(error)
          }
        }
      })
    } else {
      dropdownItems.push({
        as: '',
        href: '',
        label: 'Login',
        onClick: () => { 
          this.props.modalsLoginShow(true)
          this.setState({
            dropdownMenuIsOpen: false,
            mobileMenuIsOpen: false
          })
        }
      })
    }

    return dropdownItems
  }

  handleToggleDropdownMenu = () => {
    const { dropdownMenuIsOpen } = this.state
    this.setState({ dropdownMenuIsOpen: !dropdownMenuIsOpen })
  }

  handleToggleMobileMenu = () => {
    const { mobileMenuIsOpen } = this.state
    this.setState({ mobileMenuIsOpen: !mobileMenuIsOpen })
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = document.querySelector('.view__contents').scrollTop
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
    
    this.setState({
      dropdownMenuIsOpen: false,
      mobileMenuIsOpen: false
    })
  }

  render () {
    const { settings, user } = this.props
    const { uiTheme } = settings
    const { id } = user 
    const { dropdownMenuIsOpen, mobileMenuIsOpen } = this.state

    const dropdownText = (!!id ? <FontAwesomeIcon icon='user-circle'></FontAwesomeIcon> : null)

    return (
      <React.Fragment>
        <Navbar
          brandAs='/'
          brandHref='/?refresh=true'
          brandHideText={true}
          brandText='Podverse'
          dropdownItems={this.dropdownItems()}
          dropdownMenuIsOpen={dropdownMenuIsOpen}
          dropdownText={dropdownText}
          handleLinkClick={this.linkClick}
          handleToggleDropdownMenu={this.handleToggleDropdownMenu}
          handleToggleMobileMenu={this.handleToggleMobileMenu}
          isDarkMode={uiTheme === 'dark'}
          mobileMenuIsOpen={mobileMenuIsOpen}
          navItems={this.navItems()} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
