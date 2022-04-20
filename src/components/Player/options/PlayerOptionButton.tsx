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

type Props = {
  ariaDescription?: string
  ariaLabel?: string
  ariaPressed?: boolean
  className?: string
  onClick?: any
  size: 'small' | 'medium' | 'large'
  type: 'speed' | 'add' | 'make-clip' | 'share' | 'fullscreen-hide' | 'fullscreen-show' | 'mute' | 'unmute'
  children?: any
}

export const PlayerOptionButton = ({
  ariaDescription,
  ariaLabel,
  ariaPressed,
  className,
  onClick,
  size,
  type,
  children
}: Props) => {
  const wrapperClass = classnames(className, 'player-option-button', size)
  let icon = null
  switch (type) {
    case 'speed':
      icon = null
      break
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
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  )
}
