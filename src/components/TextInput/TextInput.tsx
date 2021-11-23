import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { useState } from "react"

type Props = {
  defaultValue?: string
  faIcon?: IconProp
  helperText?: string
  isDanger?: boolean
  label: string
  noMarginOrPadding?: boolean
  onBlur?: any
  onChange: any
  onSubmit?: any
  placeholder: string
  type: 'email' | 'password' | 'text'
  value?: string
}

export const TextInput = ({ defaultValue, faIcon, helperText, isDanger,
  label, noMarginOrPadding, onBlur, onChange, onSubmit, placeholder,
  type = 'text', value }: Props) => {
  const [tempValue, setTempValue] = useState<string>(value || defaultValue || '')
  const textInputClass = classNames(
    'text-input',
    isDanger ? 'danger' : '',
    noMarginOrPadding ? 'no-margin-or-padding' : ''
  )

  const _handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }

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
          {!!tempValue && <div className='eyebrow'>{label}</div>}
          <input
            defaultValue={defaultValue}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.value)
              setTempValue(event.target.value)
            }}
            onKeyDown={_handleKeyDown}
            placeholder={placeholder}
            type={type}
            value={value} />
        </div>
      </div>
      {helperText && <div className='helper-text'>{helperText}</div>}
    </div>
  )
}
