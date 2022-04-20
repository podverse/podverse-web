import { faChevronLeft, faChevronRight, faMoon, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import { useOmniAural } from 'omniaural'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
import { ButtonCircle, Dropdown, SwitchWithIcons } from '~/components'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'

type Props = {
  serverCookies: any
}

export const HorizontalNavBar = ({ serverCookies }: Props) => {
  const [lightModeChecked, setLightModeChecked] = useState<boolean>(serverCookies.lightMode)
  const [, setCookie, removeCookie] = useCookies([])
  const router = useRouter()
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]

  useEffect(() => {
    if (!lightModeChecked) {
      removeCookie(PV.Cookies.keys.lightMode, { path: PV.Cookies.path })
    } else {
      setCookie(PV.Cookies.keys.lightMode, lightModeChecked, { path: PV.Cookies.path })
    }
  }, [lightModeChecked])

  /* Function Helpers */

  const navigateBack = () => {
    window.history.back()
  }

  const navigateForward = () => {
    window.history.forward()
  }

  const lightModeOnChange = () => {
    setLightModeChecked((prev) => {
      document.documentElement.className = !prev ? 'theme-light' : 'theme-dark'
      return !prev
    })
  }

  /* Render Helpers */

  const dropdownItems = PV.NavBar.generateDropdownItems(t)

  return (
    <div className='horizontal-navbar-wrapper'>
      <nav className='navbar-secondary main-max-width'>
        <div className='navbar-secondary__page-navs'>
          <ButtonCircle
            ariaLabel={t('Page previous')}
            className='backwards'
            faIcon={faChevronLeft}
            onClick={navigateBack}
            size='small'
          />
          <ButtonCircle
            ariaLabel={t('Page next')}
            className='forwards'
            faIcon={faChevronRight}
            onClick={navigateForward}
            size='small'
          />
        </div>
        <div className='navbar-secondary__dropdown'>
          <Dropdown
            dropdownAriaLabel={t('My account')}
            dropdownWidthClass='width-small'
            faIcon={userInfo ? faUserCircle : faUserCircleRegular}
            onChange={(selected) => PV.NavBar.dropdownOnChange(selected, router, userInfo)}
            options={dropdownItems}
          />
        </div>
        <div className='navbar-secondary__theme-toggle'>
          <SwitchWithIcons
            ariaLabel={t('ARIA - Toggle UI theme change')}
            checked={!lightModeChecked}
            faIconBeginning={faSun}
            faIconEnding={faMoon}
            onChange={lightModeOnChange}
          />
        </div>
      </nav>
    </div>
  )
}
