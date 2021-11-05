import { faChevronLeft, faChevronRight, faMoon, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { ButtonCircle, Dropdown, SwitchWithIcons } from '~/components'

type Props = {
  t: any
}

type State = {
  checked: boolean
}

const _myProfileKey = '_myProfile'
const _membershipKey = '_membership'
const _settingsKey = '_settings'
const _logInKey = '_logIn'
const _logOutKey = '_logOut'

const switchOnChange = () => {
  console.log('toggle onChange')
}

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

export const NavBarSecondary = ({}: Props) => {
  const { t } = useTranslation()
  const isLoggedIn = false

  return (
    <nav className='navbar-secondary main-max-width'>
      <div className='navbar-secondary__page-navs'>
        <ButtonCircle className='backwards' faIcon={faChevronLeft} size='small' />
        <ButtonCircle className='forwards' faIcon={faChevronRight} size='small' />
      </div>
      <div className='navbar-secondary__dropdown'>
        <Dropdown
          faIcon={isLoggedIn ? faUserCircle : faUserCircleRegular} />
      </div>
      <div className='navbar-secondary__theme-toggle'>
        <SwitchWithIcons
          ariaLabel={t('ARIA - Toggle UI theme change')}
          faIconBeginning={faSun}
          faIconEnding={faMoon}
          onChange={switchOnChange}
        />
      </div>
    </nav>
  )
}
