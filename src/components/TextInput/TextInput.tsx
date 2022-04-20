import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useState } from 'react'
import { ButtonCircle, ButtonRectangle } from '..'

type Props = {
  ariaLabel?: string
  defaultValue?: string
  disabled?: boolean
  endButtonClass?: string
  endButtonIsLoading?: boolean
  endButtonText?: string
  faIcon?: IconProp
  faIconEnd?: IconProp
  handleEndButtonClearButtonClick?: any
  handleEndButtonClick?: any
  handleIconEndClick?: any
  helperText?: string
  isDanger?: boolean
  label?: string
  noMarginOrPadding?: boolean
  onBlur?: any
  onChange?: any
  onSubmit?: any
  placeholder?: string
  readOnly?: boolean
  type: 'email' | 'password' | 'text'
  value?: string
}

export const TextInput = ({
  ariaLabel,
  defaultValue,
  disabled,
  endButtonClass,
  endButtonIsLoading,
  endButtonText,
  faIcon,
  faIconEnd,
  handleEndButtonClearButtonClick,
  handleEndButtonClick,
  handleIconEndClick,
  helperText,
  isDanger,
  label,
  noMarginOrPadding,
  onBlur,
  onChange,
  onSubmit,
  placeholder,
  readOnly,
  type = 'text',
  value
}: Props) => {
  const [tempValue, setTempValue] = useState<string>(value || defaultValue || '')
  const textInputClass = classNames(
    'text-input',
    isDanger ? 'danger' : '',
    noMarginOrPadding ? 'no-margin-or-padding' : ''
  )

  const faIconEndClass = classNames('icon-wrapper', handleIconEndClick ? 'has-handler' : '')

  const endButtonClassName = classNames('end-button', endButtonClass ? endButtonClass : '')

  const _handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit && onSubmit()
    } else if (onBlur && event.key === 'Tab') {
      onBlur()
    }
  }

  return (
    <div className={textInputClass}>
      <div className='text-input-outer-wrapper'>
        {!!faIcon && (
          <div className='icon-wrapper'>
            <FontAwesomeIcon icon={faIcon} />
          </div>
        )}
        <div className='text-input-inner-wrapper'>
          {!!tempValue && label && <div className='eyebrow'>{label}</div>}
          <input
            aria-label={ariaLabel}
            defaultValue={defaultValue}
            disabled={disabled}
            onBlur={onBlur}
            onChange={(event) => {
              if (onChange) {
                onChange(event.target.value)
                setTempValue(event.target.value)
              }
            }}
            onKeyDown={_handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            type={type}
            value={value}
          />
        </div>
        {!!faIconEnd && (
          <div className={faIconEndClass} onClick={handleIconEndClick} tabIndex={0}>
            <FontAwesomeIcon icon={faIconEnd} />
          </div>
        )}
        {!!endButtonText && handleEndButtonClick && (
          <ButtonRectangle
            className={endButtonClassName}
            isLoading={endButtonIsLoading}
            label={endButtonText}
            onClick={handleEndButtonClick}
            type='tertiary'
          />
        )}
        {handleEndButtonClearButtonClick && (
          <ButtonCircle
            className='clear'
            faIcon={faTimes}
            iconOnly
            onClick={handleEndButtonClearButtonClick}
            size='medium'
          />
        )}
      </div>
      {helperText && (
        <div aria-live='assertive' className='helper-text'>
          {helperText}
        </div>
      )}
    </div>
  )
}
