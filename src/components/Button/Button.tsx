import classNames from 'classnames'
import React, { AriaAttributes } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import styles from '../../styles/components/Button/Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'outline' | 'link' | 'mini' | 'miniSelected' | 'miniGlow'

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
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={classNames(
        styles.button,
        styles[variant],
        { [styles.disabled]: disabled },
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
      {children}
      {isDropdownButton && <FaChevronDown className={styles.chevronIcon} />}
    </button>
  )
)
