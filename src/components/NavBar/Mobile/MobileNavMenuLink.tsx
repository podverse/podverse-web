import { faCheck } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { Icon, PVLink } from '~/components'

type Props = {
  active: boolean
  handleHideMenu: any
  href: string
  text: string
}

export const MobileNavMenuLink = ({ active, handleHideMenu, href, text }: Props) => {
  const wrapperClass = classNames('mobile-nav-menu-link', { active })

  return (
    <PVLink className={wrapperClass} href={href} onClick={handleHideMenu}>
      {text}
      {
        active && (
          <Icon faIcon={faCheck} />
        )
      }
    </PVLink>
  )
}
