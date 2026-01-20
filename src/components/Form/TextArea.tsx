import classNames from 'classnames'
import React, { AriaAttributes } from 'react'
import styles from '../../styles/components/Form/TextArea.module.scss'

type TextAreaProps = {
  value: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  eyebrow?: string
  info?: string
  placeholder?: string
  rows?: number
  type?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
  id?: string
  name?: string
  autoFocus?: boolean
  tabIndex?: number
  maxLength?: number // Add this line
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-required'?: AriaAttributes['aria-required']
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  eyebrow,
  info,
  placeholder,
  rows = 4,
  type = 'text',
  disabled = false,
  readOnly = false,
  className,
  style,
  id,
  name,
  autoFocus,
  tabIndex,
  maxLength,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  ...rest
}) => {
  const textAreaId = id || name || undefined
  const infoId = info ? `${textAreaId || 'textarea'}-info` : undefined

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof maxLength === 'number' && event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength)
    }
    onChange?.(event)
  }

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <div className={styles.textAreaWrapper}>
        <div className={styles.textInnerAreaWrapper}>
          {eyebrow && (
            <label htmlFor={textAreaId} className={styles.eyebrow}>
              {eyebrow}
            </label>
          )}
          <textarea
            id={textAreaId}
            className={styles.textArea}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            autoFocus={autoFocus}
            tabIndex={tabIndex}
            maxLength={maxLength}
            aria-label={ariaLabel}
            aria-describedby={info ? infoId : ariaDescribedBy}
            aria-required={ariaRequired}
            aria-invalid={ariaInvalid}
            {...rest}
          />
        </div>
      </div>
      {(info || typeof maxLength === 'number') && (
        <div className={styles.textAreaInfoRow}>
          {info && (
            <div id={infoId} className={styles.textAreaInfo}>
              {info}
            </div>
          )}
          {typeof maxLength === 'number' && (
            <div className={styles.textAreaCounter}>
              <span>{value.length} / {maxLength}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}