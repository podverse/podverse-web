import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
  faIcon?: IconProp
  label: string
  placeholder: string
  value: string
}

export const TextInput = ({ faIcon, label, placeholder, value }: Props) => {
  return (
    <div className='text-input-outer-wrapper'>
      {
        !!faIcon && (
          <div className='icon-wrapper'>
            <FontAwesomeIcon icon={faIcon} />
          </div>
        )
      }
      <div className='text-input-inner-wrapper'>
        {!!value && <div className='eyebrow'>{label}</div>}
        <input placeholder={placeholder} value={value} />
      </div>
    </div>
  )
}
