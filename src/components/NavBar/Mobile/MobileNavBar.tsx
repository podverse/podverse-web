import { faBars, faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import { Dropdown, Icon, NavBarBrand, PVLink } from '~/components'
import { PV } from '~/resources'
import { useState } from 'react'
import { MobileNavMenuModal } from './MobileNavMenuModal'
import { OmniAuralState } from '~/state/omniauralState'
import { eventNavBarLinkClicked } from '~/lib/utility/events'

type Props = unknown

export const MobileNavBar = (props: Props) => {
  const router = useRouter()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const { t } = useTranslation()
  const [showMobileNavMenu, setShowMobileNavMenu] = useState<boolean>(false)

  /* Render Helpers */

  const dropdownItems = PV.NavBar.generateDropdownItems()

  return (
    <>
      <div className='mobile-navbar'>
        <div className='left-wrapper'>
          <button
            aria-label={t('Show navigation menu')}
            className='nav-menu-button'
            onClick={() => setShowMobileNavMenu(true)}
            tabIndex={0}
          >
            <Icon faIcon={faBars} />
          </button>
          <NavBarBrand height={21} href={PV.RoutePaths.web.home} width={113} />
        </div>
        <div className='right-wrapper'>
          <div className='dropdown'>
            <Dropdown
              dropdownAriaLabel={t('My account')}
              faIcon={userInfo ? faUserCircle : faUserCircleRegular}
              onChange={(selected) => PV.NavBar.dropdownOnChange(selected, router, userInfo)}
              options={dropdownItems}
              text={userInfo?.name}
            />
          </div>
          <PVLink
            className='search-button'
            href={PV.RoutePaths.web.search}
            onClick={() => eventNavBarLinkClicked('search')}
          >
            <Icon faIcon={faSearch} />
          </PVLink>
        </div>
      </div>
      <MobileNavMenuModal handleHideMenu={() => setShowMobileNavMenu(false)} show={showMobileNavMenu} />
    </>
  )
}
