import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, getPriorityQueueItemsStorage } from 'podverse-ui'
import { constants } from '~/lib/constants/misc'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { modalsLoginShow, pageIsLoading, pagesClearQueryState, pagesSetQueryState,
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { logOut } from '~/services/auth'

type Props = {
  modals?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  pageIsLoading?: any
  pageKey?: string
  pagesClearQueryState?: any
  pagesSetQueryState?: any
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

  navItems (isLoggedIn: boolean) {
    const items = [
      {
        as: constants.paths.search,
        href: constants.paths.search,
        icon: 'search',
        onClick: () => { this.linkClick() },
        hideMobile: true
      },
      {
        as: constants.paths.podcasts,
        href: constants.paths.podcasts,
        label: constants.core.Podcasts,
        onClick: () => { this.linkClick() }
      },
      {
        as: constants.paths.episodes,
        href: constants.paths.episodes,
        label: constants.core.Episodes,
        onClick: () => { this.linkClick() }
      },
      {
        as: constants.paths.clips,
        href: constants.paths.clips,
        label: constants.core.Clips,
        onClick: () => { this.linkClick() }
      }
    ] as any

    if (!isLoggedIn) {
      items.push({
        as: '',
        href: '',
        label: constants.core.Login,
        onClick: () => {
          this.props.modalsLoginShow(true)
          this.setState({
            dropdownMenuIsOpen: false,
            mobileMenuIsOpen: false
          })
        },
        hideMobile: true
      })
    }

    return items
  }

  mobileNavItems (isLoggedIn: boolean) {
    const items = [
      {
        as: constants.paths.search,
        href: constants.paths.search,
        icon: 'search',
        onClick: () => { this.linkClick() }
      }
    ] as any

    if (!isLoggedIn) {
      items.push({
        as: '',
        href: '',
        label: constants.core.Login,
        onClick: () => {
          this.props.modalsLoginShow(true)
          this.setState({
            dropdownMenuIsOpen: false,
            mobileMenuIsOpen: false
          })
        }
      })
    }

    return items
  }

  dropdownItems () {
    const { pageIsLoading, pagesClearQueryState, playerQueueLoadPriorityItems, user, userSetInfo } = this.props
    const { id } = user

    const dropdownItems = [] as any

    dropdownItems.push({
      as: constants.paths.playlists,
      href: constants.paths.playlists,
      label: constants.core.Playlists,
      onClick: () => { this.linkClick() }
    })
    dropdownItems.push({
      as: constants.paths.profiles,
      href: constants.paths.profiles,
      label: constants.core.Profiles,
      onClick: () => { this.linkClick() }
    })

    if (!!id) {
      dropdownItems.push({
        as: constants.paths.my_profile,
        href: constants.paths.my_profile,
        label: constants.core.MyProfile,
        onClick: () => {
          pagesClearQueryState({ pageKey: 'my_profile' })
          pageIsLoading(true)
        }
      })
      dropdownItems.push({
        as: constants.paths.my_profile_clips,
        href: constants.paths.my_profile_clips,
        label: constants.core.MyClips,
        onClick: () => {
          pagesClearQueryState({ pageKey: 'my_profile' })
          pageIsLoading(true)
        }
      })
    }

    dropdownItems.push({
      as: constants.paths.settings,
      href: constants.paths.settings,
      label: constants.core.Settings,
      onClick: () => { this.linkClick() }
    })
    
    if (!!id) {
      dropdownItems.push({
        as: '',
        href: '',
        label:  constants.core.Logout,
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
    }

    if (!id) {
      dropdownItems.push({
        as: constants.paths.membership,
        href: constants.paths.membership,
        label: constants.core.Premium,
        onClick: () => { this.linkClick() }
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

    const scrollPos = getViewContentsElementScrollTop()
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
          brandHref='/'
          brandHideText={true}
          brandText='Podverse'
          dropdownItems={this.dropdownItems()}
          dropdownMenuIsOpen={dropdownMenuIsOpen}
          dropdownText={dropdownText}
          handleLinkClick={this.linkClick}
          handleToggleDropdownMenu={this.handleToggleDropdownMenu}
          handleToggleMobileMenu={this.handleToggleMobileMenu}
          isDarkMode={uiTheme === constants.attributes.dark}
          mobileMenuIsOpen={mobileMenuIsOpen}
          mobileNavItems={this.mobileNavItems(!!id)}
          navItems={this.navItems(!!id)} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesClearQueryState: bindActionCreators(pagesClearQueryState, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PVNavBar)
