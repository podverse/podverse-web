import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, getPriorityQueueItemsStorage } from 'podverse-ui'
import PV from '~/lib/constants'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { modalsLoginShow, pageIsLoading, pagesClearQueryState, pagesSetQueryState,
  playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { logOut } from '~/services/auth'
import { withTranslation } from 'i18n'

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
  t: any
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
    const { t } = this.props
    const items = [
      {
        as: PV.paths.web.search,
        href: PV.paths.web.search,
        icon: 'search',
        onClick: () => { this.linkClick() },
        hideMobile: true
      },
      {
        as: PV.paths.web.podcasts,
        href: PV.paths.web.podcasts,
        label: t('Podcasts'),
        onClick: () => { this.linkClick() }
      },
      {
        as: PV.paths.web.episodes,
        href: PV.paths.web.episodes,
        label: t('Episodes'),
        onClick: () => { this.linkClick() }
      },
      {
        as: PV.paths.web.clips,
        href: PV.paths.web.clips,
        label: t('Clips'),
        onClick: () => { this.linkClick() }
      }
    ] as any

    if (!isLoggedIn) {
      items.push({
        as: '',
        href: '',
        label: t('Login'),
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
    const { t } = this.props
    const items = [
      {
        as: PV.paths.web.search,
        href: PV.paths.web.search,
        icon: 'search',
        onClick: () => { this.linkClick() }
      }
    ] as any

    if (!isLoggedIn) {
      items.push({
        as: '',
        href: '',
        label: t('Login'),
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
    const { pageIsLoading, pagesClearQueryState, playerQueueLoadPriorityItems, t, user, userSetInfo } = this.props
    const { id } = user

    const dropdownItems = [] as any

    dropdownItems.push({
      as: PV.paths.web.playlists,
      href: PV.paths.web.playlists,
      label: t('Playlists'),
      onClick: () => { this.linkClick() }
    })
    dropdownItems.push({
      as: PV.paths.web.profiles,
      href: PV.paths.web.profiles,
      label: t('Profiles'),
      onClick: () => { this.linkClick() }
    })

    if (!!id) {
      dropdownItems.push({
        as: PV.paths.web.my_profile,
        href: PV.paths.web.my_profile,
        label: t('MyProfile'),
        onClick: () => {
          pagesClearQueryState({ pageKey: 'my_profile' })
          pageIsLoading(true)
        }
      })
      dropdownItems.push({
        as: PV.paths.web.my_profile_clips,
        href: PV.paths.web.my_profile_clips,
        label: t('MyClips'),
        onClick: () => {
          pagesClearQueryState({ pageKey: 'my_profile' })
          pageIsLoading(true)
        }
      })
    }

    dropdownItems.push({
      as: PV.paths.web.settings,
      href: PV.paths.web.settings,
      label: t('Settings'),
      onClick: () => { this.linkClick() }
    })
    
    if (!!id) {
      dropdownItems.push({
        as: '',
        href: '',
        label:  t('Logout'),
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
        as: PV.paths.web.membership,
        href: PV.paths.web.membership,
        label: t('Premium'),
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
          isDarkMode={uiTheme === PV.attributes.dark}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(PVNavBar))
