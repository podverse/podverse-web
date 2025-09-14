import React from 'react'
import styles from '../../styles/components/Form/TextInput.module.scss'
import { Button } from '../Button/Button'

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
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  button?: TextInputButton
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
  ...rest
}) => {
  const inputId = id || name || undefined
  const infoId = info ? `${inputId || 'textinput'}-info` : undefined

  return (
    <div className={`${styles.textInput} ${className || ''}`} style={style}>
      <div className={styles.textInputWrapper}>
        <div className={styles.textInnerInputWrapper}>
          {eyebrow && value && (
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
            {...rest}
          />
          {info && (
            <div id={infoId} className={styles.textInputInfo}>
              {info}
            </div>
          )}
        </div>
        {button && (
          <Button
            className={styles.button}
            onClick={button.onClick}
            variant='tertiary'
            >
            {button.label}
          </Button>
        )}
      </div>
    </div>
  )
}