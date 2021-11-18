import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp as FAIconProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'

type Props = {
  className?: string
  faIcon: FAIconProp
  spin?: boolean
}

export const Icon = ({ className, faIcon, spin }: Props) => {
  const iconWrapperClassName = classNames(
    'icon',
    className ? className : ''
  )

  return (
    <span className={iconWrapperClassName} aria-hidden='true'>
      <FontAwesomeIcon
        icon={faIcon}
        spin={spin} />
    </span>
  )
}
