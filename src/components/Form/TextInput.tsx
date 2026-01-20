import React, { AriaAttributes } from 'react'
import styles from '../../styles/components/Form/TextInput.module.scss'
import { Button } from '../Button/Button'
import { TextInputNumberIncrement } from './TextInputNumberIncrements'
import classNames from 'classnames'

type TextInputProps = {
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  eyebrow?: string
  info?: string
  infoError?: string
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
  buttonIcon?: TextInputButtonIcon
  onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
}

export type TextInputButton = {
  label: string
  onClick: () => void
}

export type TextInputButtonIcon = {
  position: "start" | "end"
  icon: React.ReactNode
  className?: string
  onClick: () => void
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onBlur,
  eyebrow,
  info,
  infoError,
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
  buttonIcon,
  onWheel,
  min,
  max,
  step,
  ...rest
}) => {
  const inputId = id || name || undefined
  const infoId = info ? `${inputId || 'textinput'}-info` : undefined
  const infoErrorId = infoError ? `${inputId || 'textinput'}-error` : undefined

  return (
    <div className={`${styles.textInput} ${className || ''}`} style={style}>
      <div className={styles.textInputWrapper}>
        {buttonIcon?.position === "start" && (
          <button
            className={classNames(
              styles.searchIcon,
              styles.buttonIcon,
              {
                [styles.buttonIconStart]: true,
                [styles.buttonIconEnd]: false,
              },
              buttonIcon.className
            )}
            onClick={buttonIcon.onClick}>
            {buttonIcon.icon}
          </button>
        )}
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
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            tabIndex={tabIndex}
            aria-label={ariaLabel}
            aria-describedby={info ? infoId : ariaDescribedBy}
            aria-required={ariaRequired}
            className={classNames(styles.input, { [styles.numberInput]: type === 'number' })}
            aria-invalid={ariaInvalid}
            onWheel={onWheel}
            min={min}
            max={max}
            step={step}
            {...rest}
          />
        </div>
        {type === 'number' && (
          <TextInputNumberIncrement
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
        {button && (
          <Button
            className={styles.button}
            onClick={button.onClick}
            variant='mini'
          >
            {button.label}
          </Button>
        )}
        {buttonIcon?.position === "end" && (
          <button
            className={classNames(
              styles.searchIcon,
              styles.buttonIcon,
              {
                [styles.buttonIconStart]: true,
                [styles.buttonIconEnd]: false,
              },
              buttonIcon.className
            )}
            onClick={buttonIcon.onClick}>
            {buttonIcon.icon}
          </button>
        )}
      </div>
      {info && (
        <div id={infoId} className={styles.textInputInfo}>
          {info}
        </div>
      )}
      {infoError && (
        <div id={infoErrorId} className={styles.textInputInfoError}>
          {infoError}
        </div>
      )}
    </div>
  )
}