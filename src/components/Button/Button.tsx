import React from 'react'
import classNames from 'classnames'
import styles from '../../styles/components/Button/Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'outline' | 'link'

type ButtonProps = {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  variant?: ButtonVariant
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-pressed'?: boolean
  tabIndex?: number
  autoFocus?: boolean
  id?: string
  name?: string
  title?: string
  role?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className,
  style,
  variant = 'primary',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-pressed': ariaPressed,
  tabIndex,
  autoFocus,
  id,
  name,
  title,
  role = 'button',
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
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
    tabIndex={tabIndex}
    autoFocus={autoFocus}
    id={id}
    name={name}
    title={title}
    role={role}
    {...rest}
  >
    {children}
  </button>
)