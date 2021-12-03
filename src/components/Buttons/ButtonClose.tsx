import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

type Props = {
  onClick: any
}

export const ButtonClose = ({ onClick }: Props) => {
  return (
    <button className='button-close' onClick={onClick}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  )
}
