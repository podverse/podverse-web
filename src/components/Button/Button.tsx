import classNames from 'classnames'
import React, { AriaAttributes } from 'react'
import { FaChevronDown, FaSpinner } from 'react-icons/fa'
import styles from '../../styles/components/Button/Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'outline' | 'link' | 'mini' | 'miniSelected' | 'miniGlow' | 'miniGlowWarning'

type ButtonProps = {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  variant?: ButtonVariant
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-pressed'?: AriaAttributes['aria-pressed']
  'aria-haspopup'?: AriaAttributes['aria-haspopup']
  'aria-expanded'?: AriaAttributes['aria-expanded']
  tabIndex?: number
  autoFocus?: boolean
  id?: string
  name?: string
  title?: string
  role?: string
  isDropdownButton?: boolean
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      onKeyDown,
      type = 'button',
      disabled = false,
      className,
      style,
      variant = 'primary',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-pressed': ariaPressed,
      'aria-haspopup': ariaHasPopup,
      'aria-expanded': ariaExpanded,
      tabIndex,
      autoFocus,
      id,
      name,
      title,
      role = 'button',
      isDropdownButton = false,
      isLoading = false,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled || isLoading}
      className={classNames(
        styles.button,
        styles[variant],
        { [styles.disabled]: disabled || isLoading },
        className
      )}
      style={style}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      id={id}
      name={name}
      title={title}
      role={role}
      {...rest}
    >
      <span className={classNames(styles.buttonContent, { [styles.invisible]: isLoading })}>
        {children}
        {isDropdownButton && <FaChevronDown className={styles.chevronIcon} />}
      </span>
      {isLoading && (
        <span className={styles.spinnerWrapper}>
          <FaSpinner className={styles.spinner} />
        </span>
      )}
    </button>
  )
)
