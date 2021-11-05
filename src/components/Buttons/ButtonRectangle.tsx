import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  faIcon: IconProp
}

export const ButtonRectangle = ({ faIcon }: Props) => {
  return (
    <button className='button-rectangle'>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}