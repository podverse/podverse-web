import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"

type Props = {
  faIcon?: IconProp
  helperText?: string
  isDanger?: boolean
  label: string
  onBlur: any
  onChange: any
  placeholder: string
  type: 'email' | 'password' | 'text'
  value: string
}

export const TextInput = ({ faIcon, helperText, isDanger, label, onBlur,
  onChange, placeholder, type = 'text', value }: Props) => {
  const textInputClass = classNames(
    'text-input',
    isDanger ? 'danger' : ''
  )

  return (
    <div className={textInputClass}>
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
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            type={type}
            value={value} />
        </div>
      </div>
      {helperText && <div className='helper-text'>{helperText}</div>}
    </div>
  )
}
