import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { faUserCircle as farUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faUserCircle as fasUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from 'podverse-ui'
import PV from '~/lib/constants'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { modalsHistoryShow, modalsLoginShow, pageIsLoading, pagesClearQueryState,
  pagesSetQueryState, playerQueueLoadPriorityItems, userSetInfo } from '~/redux/actions'
import { logOut } from '~/services/auth'
import { withTranslation } from 'i18n'
import { getQueueItems } from '~/services/userQueueItem'

interface Props {
  modals?: any
  modalsHistoryShow?: any
  modalsLoginIsLoading?: any
  modalsLoginShow?: any
  pageIsLoading?: any
  pageKey?: string
  pagesClearQueryState?: any
  pagesSetQueryState?: any
  playerQueueLoadPriorityItems?: any
  settings?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

class PVNavBar extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  navItems () {
    const items = [
      {
        as: PV.paths.web.search,
        href: PV.paths.web.search,
        icon: 'search',
        onClick: () => { this.linkClick() },
        hideMobile: true
      }
    ] as any

    return items
  }

  myLibraryDropdownItems () {
    const { pageIsLoading, pagesClearQueryState, t } = this.props
    const dropdownItems = [] as any

    dropdownItems.push({
      as: PV.paths.web.queue,
      href: PV.paths.web.queue,
      label: t('Queue'),
      onClick: () => {
        pageIsLoading(true)
      }
    })


    dropdownItems.push({
      as: PV.paths.web.history,
      href: PV.paths.web.history,
      label: t('History'),
      onClick: () => {
        pageIsLoading(true)
      }
    })

    dropdownItems.push({
      as: PV.paths.web.my_profile_clips,
      href: PV.paths.web.my_profile_clips,
      label: t('My Clips'),
      onClick: () => {
        pagesClearQueryState({ pageKey: 'my_profile' })
        pageIsLoading(true)
      }
    })

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

    return dropdownItems
  }

  myAccountDropdownItems = () => {
    const { playerQueueLoadPriorityItems, t, user, userSetInfo } = this.props
    const { id } = user
    const dropdownItems = [] as any

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
    }

    dropdownItems.push({
      as: PV.paths.web.settings,
      href: PV.paths.web.settings,
      label: t('Settings'),
      onClick: () => { this.linkClick() }
    })

    if (!id) {
      dropdownItems.push({
        as: PV.paths.web.membership,
        href: PV.paths.web.membership,
        label: t('Premium'),
        onClick: () => { this.linkClick() }
      })

      dropdownItems.push({
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

    if (!!id) {
      dropdownItems.push({
        as: '',
        href: '',
        label: t('Logout'),
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
            const queueItems = await getQueueItems(user)
            playerQueueLoadPriorityItems(queueItems)
            window.location.reload()
          } catch (error) {
            console.log(error)
          }
        }
      })
    }

    return dropdownItems
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  dropdowns = () => {
    const { t, user } = this.props
    const { id } = user

    return [
      {
        label: t('My Library'),
        items: this.myLibraryDropdownItems()
      },
      {
        icon: !!id ? fasUserCircle : farUserCircle,
        items: this.myAccountDropdownItems()
      }
    ]
  }

  render () {
    const { settings } = this.props
    const { uiTheme } = settings
    const dropdowns = this.dropdowns()
    const navItems = this.navItems()

    return (

        <Navbar
          brandAs='/'
          brandHref='/'
          brandHideText={true}
          brandText='Podverse'
          dropdowns={dropdowns}
          handleLinkClick={this.linkClick}
          isDarkMode={uiTheme === PV.attributes.dark}
          navItems={navItems} />

    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsHistoryShow: bindActionCreators(modalsHistoryShow, dispatch),
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesClearQueryState: bindActionCreators(pagesClearQueryState, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  playerQueueLoadPriorityItems: bindActionCreators(playerQueueLoadPriorityItems, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(PVNavBar))
