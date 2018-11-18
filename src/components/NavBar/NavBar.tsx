import React, { StatelessComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar } from 'podverse-ui'

type Props = {}

const dropdownItems = [
  {
    as: '/settings',
    href: '/settings',
    label: 'Settings'
  },
  {
    href: '#',
    label: 'Log out'
  }
]

const navItems = [
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

const PVNavBar: StatelessComponent<Props> = props => {
  const dropdownText = (<FontAwesomeIcon icon='user-circle'></FontAwesomeIcon>)

  return (
    <Navbar
      brandHideText={true}
      brandText='Podverse'
      brandUrl='/'
      dropdownItems={dropdownItems}
      dropdownText={dropdownText}
      navItems={navItems} />
  )
}

export default PVNavBar
