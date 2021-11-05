import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classnames from 'classnames'

type Props = {
  className?: string
  faIcon: IconProp
  size: 'small'
}

export const ButtonCircle = ({ className, faIcon, size }: Props) => {
  const wrapperClass = classnames(
    'button-circle',
    size,
    className
  )

  return (
    <button className={wrapperClass}>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}
