import React from 'react'
import styles from '../../styles/components/TextInput/TextInput.module.scss'

type TextInputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  eyebrow?: string
  info?: string
  placeholder?: string
  type?: string
  disabled?: boolean
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
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  eyebrow,
  info,
  placeholder,
  type = 'text',
  disabled = false,
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
      </div>
    </div>
  )
}