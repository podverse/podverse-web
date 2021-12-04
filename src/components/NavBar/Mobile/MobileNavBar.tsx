import { faBars, faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from "next/router"
import { useOmniAural } from 'omniaural'
import { useTranslation } from "react-i18next"
import { Dropdown, Icon, NavBarBrand, PVLink } from "~/components"
import { PV } from "~/resources"

type Props = {}

export const MobileNavBar = (props: Props) => {
  const router = useRouter()
  const [userInfo] = useOmniAural('session.userInfo')
  const { t } = useTranslation()

  /* Render Helpers */

  const dropdownItems = PV.NavBar.generateDropdownItems(t)

  return (
    <div className='mobile-navbar'>
      <div className='left-wrapper'>
        <div className='nav-menu-button' tabIndex={0}>
          <Icon faIcon={faBars} />
        </div>
        <NavBarBrand height={21} href={PV.RoutePaths.web.home} src={PV.Images.dark.brandLogo} width={113} />
      </div>
      <div className='right-wrapper'>
        <div className='dropdown'>
          <Dropdown
            faIcon={!!userInfo ? faUserCircle : faUserCircleRegular}
            onChange={(selected) => PV.NavBar.dropdownOnChange(selected, router, userInfo)}
            options={dropdownItems}
          />
        </div>
        <PVLink className='search-button' href={PV.RoutePaths.web.search}>
          <Icon faIcon={faSearch} />
        </PVLink>
      </div>
    </div>
  )
}
