import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
  faIcon?: IconProp
  label: string
  onChange: any
  placeholder: string
  type: 'email' | 'password' | 'text'
  value: string
}

export const TextInput = ({ faIcon, label, onChange, placeholder, type = 'text',
  value }: Props) => {
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
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value} />
      </div>
    </div>
  )
}
