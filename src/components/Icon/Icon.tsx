import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp as FAIconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  faIcon: FAIconProp
}

export const Icon = ({ faIcon }: Props) => {
  return (
    <span className='icon' aria-hidden='true'>
      <FontAwesomeIcon icon={faIcon} />
    </span>
  )
}
