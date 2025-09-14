import React, { AriaAttributes } from 'react'
import styles from '../../styles/components/Form/TextInput.module.scss'
import { Button } from '../Button/Button'
import { TextInputNumberIncrement } from './TextInputNumberIncrements'

type TextInputProps = {
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  eyebrow?: string
  info?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
  id?: string
  name?: string
  autoFocus?: boolean
  tabIndex?: number
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-required'?: AriaAttributes['aria-required']
  'aria-invalid'?: AriaAttributes['aria-invalid']
  button?: TextInputButton
  onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
}

export type TextInputButton = {
  label: string
  onClick: () => void
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  eyebrow,
  info,
  placeholder,
  type = 'text',
  disabled = false,
  readOnly = false,
  className,
  style,
  id,
  name,
  autoFocus,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  button,
  onWheel,
  min,
  max,
  step,
  ...rest
}) => {
  const inputId = id || name || undefined
  const infoId = info ? `${inputId || 'textinput'}-info` : undefined

  return (
    <div className={`${styles.textInput} ${className || ''}`} style={style}>
      <div className={styles.textInputWrapper}>
        <div className={styles.textInnerInputWrapper}>
          {eyebrow && (
            <label htmlFor={inputId} className={styles.eyebrow}>
              {eyebrow}
            </label>
          )}
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            tabIndex={tabIndex}
            aria-label={ariaLabel}
            aria-describedby={info ? infoId : ariaDescribedBy}
            aria-required={ariaRequired}
            aria-invalid={ariaInvalid}
            className={styles.input}
            onWheel={onWheel}
            min={min}
            max={max}
            step={step}
            style={type === 'number' ? { MozAppearance: 'textfield' } : undefined}
            {...rest}
          />
          {info && (
            <div id={infoId} className={styles.textInputInfo}>
              {info}
            </div>
          )}
        </div>
        {type === 'number' ? (
          <TextInputNumberIncrement
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
          />
        ) : button && (
          <Button
            className={styles.button}
            onClick={button.onClick}
            variant='miniPrimary'
          >
            {button.label}
          </Button>
        )}
      </div>
    </div>
  )
}