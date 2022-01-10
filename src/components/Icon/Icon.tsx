import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp as FAIconProp, RotateProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'

type Props = {
  className?: string
  faIcon: FAIconProp
  rotation?: RotateProp
  spin?: boolean
}

export const Icon = ({ className, faIcon, rotation, spin }: Props) => {
  const iconWrapperClassName = classNames('icon', className ? className : '')

  return (
    <span className={iconWrapperClassName} aria-hidden='true'>
      <FontAwesomeIcon icon={faIcon} rotation={rotation} spin={spin} />
    </span>
  )
}
