import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'

type Props = {
  ariaLabel?: string
  className?: string
  faIcon: IconProp
  href?: string
  isLink?: boolean
  isSecondary?: boolean
  onClick?: any
  rel?: 'noreferrer'
  target?: '_blank'
}

export const ButtonIcon = ({
  ariaLabel,
  className,
  faIcon,
  href,
  isLink,
  isSecondary,
  onClick,
  rel,
  target
}: Props) => {
  const buttonClass = classnames(
    'button-icon',
    className ? className : null,
    isSecondary ? 'is-secondary' : null,
    isLink ? 'is-link' : null
  )

  if (href) {
    return (
      <a aria-label={ariaLabel} className={buttonClass} href={href} rel={rel} target={target}>
        <FontAwesomeIcon icon={faIcon} />
      </a>
    )
  } else {
    return (
      <button aria-label={ariaLabel} className={buttonClass} onClick={onClick}>
        <FontAwesomeIcon icon={faIcon} />
      </button>
    )
  }
}
