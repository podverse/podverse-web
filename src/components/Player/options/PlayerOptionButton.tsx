import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faCut,
  faShare,
  faExpandAlt,
  faVolumeMute,
  faVolumeUp,
  faCompressAlt
} from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { PVLink } from '~/components'

type Props = {
  ariaDescription?: string
  ariaLabel?: string
  ariaPressed?: boolean
  className?: string
  linkUrl?: string
  onClick?: any
  size: 'small' | 'medium' | 'large'
  type: 'add' | 'make-clip' | 'share' | 'fullscreen-hide' | 'fullscreen-show' | 'mute' | 'unmute' | 'value-enabled'
  children?: any
}

export const PlayerOptionButton = ({
  ariaDescription,
  ariaLabel,
  ariaPressed,
  className,
  linkUrl,
  onClick,
  size,
  type,
  children
}: Props) => {
  const wrapperClass = classnames(className, 'player-option-button', size)
  let icon = null
  switch (type) {
    case 'add':
      icon = faPlus
      break
    case 'make-clip':
      icon = faCut
      break
    case 'share':
      icon = faShare
      break
    case 'fullscreen-hide':
      icon = faCompressAlt
      break
    case 'fullscreen-show':
      icon = faExpandAlt
      break
    case 'mute':
      icon = faVolumeMute
      break
    case 'unmute':
      icon = faVolumeUp
      break
    default:
      break
  }

  return (
    <button
      aria-description={ariaDescription}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={wrapperClass}
      onClick={onClick}
      {...(type === 'value-enabled' ? { tabIndex: -1 } : {})}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {type === 'value-enabled' && (
        <PVLink href={linkUrl} target='_blank'>
          ⚡️
        </PVLink>
      )}
      {children}
    </button>
  )
}
