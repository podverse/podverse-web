import React, { AriaAttributes } from 'react'
import styles from '../../styles/components/Form/TextInputHHMMSS.module.scss'
import { FaPlay } from 'react-icons/fa6'
import { formatInputToHHMMSS } from 'podverse-helpers'

type TextInputHHMMSSProps = {
  value: string
  onChange: (val: string) => void
  eyebrow?: string
  className?: string
  name: string
  placeholder: string
  onButtonClick: () => void
  buttonAriaLabel: string
  'aria-label': string
  'aria-describedby'?: string
  'aria-required'?: AriaAttributes['aria-required']
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

export const TextInputHHMMSS: React.FC<TextInputHHMMSSProps> = ({
  value,
  onChange,
  eyebrow,
  className,
  name,
  placeholder,
  onButtonClick,
  buttonAriaLabel,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid
}) => {
  const inputId = name || undefined;

  return (
    <div className={`${styles.hhmmss} ${className || ''}`}>
      <div className={styles.hhmmssInputWrapper}>
        <div className={styles.hhmmssInnerInputWrapper}>
          {eyebrow && (
            <label htmlFor={inputId} className={styles.eyebrow}>
              {eyebrow}
            </label>
          )}
          <input
            className={styles.input}
            id={inputId}
            name={name}
            type="text"
            value={value}
            onChange={(val) => {
              onChange(formatInputToHHMMSS(val.target.value));
            }}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-required={ariaRequired}
            aria-invalid={ariaInvalid}
          />
        </div>
        <button
          className={styles.buttonWrapper}
          type="button"
          aria-label={buttonAriaLabel}>
          <FaPlay
            className={styles.playIcon}
            onClick={onButtonClick} />
        </button>
      </div>
    </div>
  )
}