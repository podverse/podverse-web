import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AriaAttributes } from 'react'

type Props = {
  ariaLabel?: string
  ariaPressed?: AriaAttributes['aria-pressed']
  className?: string
  faIcon: IconProp
  iconOnly?: boolean
  isLoading?: boolean
  onClick?: any
  size: 'small' | 'medium' | 'large'
}

export const ButtonCircle = ({ ariaLabel, ariaPressed, className, faIcon, iconOnly, isLoading, onClick, size }: Props) => {
  const wrapperClass = classnames('button-circle', size, className, iconOnly ? 'icon-only' : '')

  return (
    <button aria-label={ariaLabel} aria-pressed={ariaPressed} className={wrapperClass} onClick={onClick}>
      {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
      {!isLoading && <FontAwesomeIcon icon={faIcon} />}
    </button>
  )
}
