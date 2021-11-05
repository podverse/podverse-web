import { faChevronLeft, faChevronRight, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle as faUserCircleRegular } from '@fortawesome/free-regular-svg-icons'
import { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { ButtonCircle, Dropdown, Switch } from '~/components'
import { PV } from '~/resources'

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

class NavBarSecondary extends Component<Props, State> {

  switchOnChange = () => {
    console.log('toggle onChange')
  }

  generateDropdownItems = () => {
    const { t } = this.props
    const isLoggedIn = false

    const items = [
      { label: t('Membership'), key: _membershipKey},
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

  render() {
    const { t } = this.props
    console.log('t', t)

    const isLoggedIn = false
  
    return (
      <nav className='navbar-secondary'>
        <div className='navbar-secondary__page-navs'>
          <ButtonCircle className='backwards' faIcon={faChevronLeft} size='small' />
          <ButtonCircle className='forwards' faIcon={faChevronRight} size='small' />
        </div>
        <div className='navbar-secondary__dropdown'>
          <Dropdown
            faIcon={isLoggedIn ? faUserCircle : faUserCircleRegular} />
        </div>
        <div className='navbar-secondary__theme-toggle'>
          <Switch
            label={t('ARIA - Toggle UI theme change')}
            onChange={this.switchOnChange}
          />
        </div>
      </nav>
    )
  }
}

export default withTranslation()(NavBarSecondary)
