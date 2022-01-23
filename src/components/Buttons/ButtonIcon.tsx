import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'

type Props = {
  className?: string
  faIcon: IconProp
  isSecondary?: boolean
  onClick?: any
}

export const ButtonIcon = ({ className, faIcon, isSecondary, onClick }: Props) => {
  const buttonClass = classnames('button-icon', className ? className : null, isSecondary ? 'is-secondary' : null)

  return (
    <button className={buttonClass} onClick={onClick}>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}
