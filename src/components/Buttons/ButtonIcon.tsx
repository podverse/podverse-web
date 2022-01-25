import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'

type Props = {
  className?: string
  faIcon: IconProp
  href?: string
  isSecondary?: boolean
  onClick?: any
  rel?: 'noreferrer'
  target?: '_blank'
}

export const ButtonIcon = ({ className, faIcon, href, isSecondary, onClick, rel, target }: Props) => {
  const buttonClass = classnames('button-icon', className ? className : null, isSecondary ? 'is-secondary' : null)

  if (href) {
    return (
      <a href={href} rel={rel} target={target}>
        <FontAwesomeIcon icon={faIcon} />
      </a>
    )
  } else {
    return (
      <button className={buttonClass} onClick={onClick}>
        <FontAwesomeIcon icon={faIcon} />
      </button>
    )
  }

}
