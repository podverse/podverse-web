import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classnames from 'classnames'
import { Icon, PVLink } from '~/components'

type Props = {
  active?: boolean
  faIconBeginning?: IconProp
  href: string
  onClick?: any
  text: string
}

export const NavBarLink = ({ active, faIconBeginning, href, onClick, text }: Props) => {
  const wrapperClass = classnames('navbar__link', { active })

  return (
    <PVLink className={wrapperClass} href={href} onClick={onClick}>
      {!!faIconBeginning && (
        <span className='navbar-link__icon-wrapper'>
          <Icon faIcon={faIconBeginning} />
        </span>
      )}
      {text}
    </PVLink>
  )
}
