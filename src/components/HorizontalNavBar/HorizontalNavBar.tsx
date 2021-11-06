import { useEffect, useState } from 'react'
import { faChevronLeft, faChevronRight, faMoon, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie';
import { ButtonCircle, Dropdown, SwitchWithIcons } from '~/components'
import { PV } from '~/resources'
import OmniAural from "omniaural"

type Props = {
  serverSideCookies: any
}

const _myProfileKey = '_myProfile'
const _membershipKey = '_membership'
const _settingsKey = '_settings'
const _logInKey = '_logIn'
const _logOutKey = '_logOut'

const generateDropdownItems = () => {
  const { t } = useTranslation()
  const isLoggedIn = false

  const items = [
    { label: t('Membership'), key: _membershipKey },
    { label: t('Settings'), key: _settingsKey },
  ]

  if (isLoggedIn) {
    items.unshift({ label: t('MyProfile'), key: _myProfileKey })
    items.push({ label: t('LogIn'), key: _logInKey })
  } else {
    items.push({ label: t('LogOut'), key: _logOutKey })
  }

  return items
}

export const HorizontalNavBar = ({ serverSideCookies }: Props) => {
  const [darkModeChecked, setDarkModeChecked] = useState<boolean>(serverSideCookies.darkMode)
  const [cookies, setCookie, removeCookie] = useCookies([])
  const { t } = useTranslation()
  const isLoggedIn = false

  useEffect(() => {
    if (!darkModeChecked) {
      removeCookie(PV.Cookies.keys.darkMode, { path: PV.Cookies.path })
    } else {
      setCookie(PV.Cookies.keys.darkMode, darkModeChecked, { path: PV.Cookies.path })
    }
  }, [darkModeChecked])

  const navigateBack = () => {
    window.history.back()
  }

  const navigateForward = () => {
    window.history.forward()

    OmniAural.togglePlayer(!OmniAural.state.player.show.value())
  }

  const darkModeOnChange = () => {
    setDarkModeChecked(prev => {
      document.documentElement.className = !prev ? 'theme-dark' : 'theme-light'
      return !prev
    })
  }

  return (
    <nav className='navbar-secondary main-max-width'>
      <div className='navbar-secondary__page-navs'>
        <ButtonCircle
          className='backwards'
          faIcon={faChevronLeft}
          onClick={navigateBack}
          size='small' />
        <ButtonCircle
          className='forwards'
          faIcon={faChevronRight}
          onClick={navigateForward}
          size='small' />
      </div>
      <div className='navbar-secondary__dropdown'>
        <Dropdown
          faIcon={isLoggedIn ? faUserCircle : faUserCircleRegular} />
      </div>
      <div className='navbar-secondary__theme-toggle'>
        <SwitchWithIcons
          ariaLabel={t('ARIA - Toggle UI theme change')}
          checked={!!darkModeChecked}
          faIconBeginning={faSun}
          faIconEnding={faMoon}
          onChange={darkModeOnChange} />
      </div>
    </nav>
  )
}
