import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp as FAIconProp, RotateProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'

type Props = {
  className?: string
  customIcon?: any
  faIcon?: FAIconProp
  rotation?: RotateProp
  spin?: boolean
}

export const Icon = ({ className, customIcon, faIcon, rotation, spin }: Props) => {
  const iconWrapperClassName = classNames('icon', className ? className : '')

  if (customIcon) {
    return (
      <span className={iconWrapperClassName} aria-hidden='true'>
        {customIcon}
      </span>
    )
  } else {
    return (
      <span className={iconWrapperClassName} aria-hidden='true'>
        <FontAwesomeIcon icon={faIcon} rotation={rotation} spin={spin} />
      </span>
    )
  }
}
