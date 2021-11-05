import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  faIcon: IconProp
}

export const ButtonSquare = ({ faIcon }: Props) => {
  return (
    <button className='button-square'>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}