import { faCheck } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { Icon, PVLink } from '~/components'

type Props = {
  active: boolean
  handleHideMenu: any
  href: string
  onClick?: any
  text: string
}

export const MobileNavMenuLink = ({ active, handleHideMenu, href, onClick, text }: Props) => {
  const wrapperClass = classNames('mobile-nav-menu-link', { active })

  return (
    <PVLink
      className={wrapperClass}
      href={href}
      onClick={() => {
        handleHideMenu()
        onClick?.()
      }}
    >
      {text}
      {active && <Icon faIcon={faCheck} />}
    </PVLink>
  )
}
