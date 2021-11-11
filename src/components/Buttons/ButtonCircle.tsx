import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classnames from 'classnames'

type Props = {
  className?: string
  faIcon: IconProp
  onClick?: any
  size: 'small' | 'medium'
}

export const ButtonCircle = ({ className, faIcon, onClick, size }: Props) => {
  const wrapperClass = classnames(
    'button-circle',
    size,
    className
  )

  return (
    <button className={wrapperClass} onClick={onClick}>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}
