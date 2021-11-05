import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  faIcon: IconProp
  text?: string
}

export const Dropdown = ({ faIcon, text }: Props) => {
  return (
    <button className='dropdown-wrapper'>
      {
        !!faIcon && (
          <div className='dropdown__icon'>
            <FontAwesomeIcon icon={faIcon} />
          </div>
        )
      }
      {
        !!text && (
          <div className='dropdown__text'>
            {text}
          </div>
        )
      }
      <div className='dropdown__chevron'>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
    </button>
  )
}
