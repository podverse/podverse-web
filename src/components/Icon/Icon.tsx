import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp as FAIconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  faIcon: FAIconProp
  spin?: boolean
}

export const Icon = ({ faIcon, spin }: Props) => {
  return (
    <span className='icon' aria-hidden='true'>
      <FontAwesomeIcon
        icon={faIcon}
        spin={spin} />
    </span>
  )
}
