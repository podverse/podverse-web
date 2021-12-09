import OmniAural from 'omniaural'
import { logOut } from '~/services/auth'
import { RoutePaths } from './RoutePaths'

const generateDropdownItems = (t: any) => {
  const isLoggedIn = !!OmniAural.state.session.userInfo.value()
  const items = [
    { label: t('Membership'), key: NavBar.dropdownKeys._membershipKey }
    // { label: t('Settings'), key: NavBar.dropdownKeys._settingsKey }
  ]

  if (isLoggedIn) {
    items.unshift({ label: t('MyProfile'), key: NavBar.dropdownKeys._myProfileKey })
    items.push({ label: t('Logout'), key: NavBar.dropdownKeys._logOutKey })
  } else {
    items.push({ label: t('Login'), key: NavBar.dropdownKeys._logInKey })
  }

  return items
}

const dropdownOnChange = async (selected, router: any, userInfo: any) => {
  const item = selected[0]
  if (item) {
    if (item.key === NavBar.dropdownKeys._myProfileKey) {
      router.push(`${RoutePaths.web.profile}/${userInfo.id}`)
    } else if (item.key === NavBar.dropdownKeys._membershipKey) {
      router.push(RoutePaths.web.membership)
    } else if (item.key === NavBar.dropdownKeys._settingsKey) {
      router.push(RoutePaths.web.settings)
    } else if (item.key === NavBar.dropdownKeys._logInKey) {
      OmniAural.modalsLoginShow()
    } else if (item.key === NavBar.dropdownKeys._logOutKey) {
      await logOut()
    }
  }
}

export const NavBar = {
  dropdownKeys: {
    _myProfileKey: '_myProfile',
    _membershipKey: '_membership',
    _settingsKey: '_settings',
    _logInKey: '_logIn',
    _logOutKey: '_logOut'
  },
  generateDropdownItems,
  dropdownOnChange
}
