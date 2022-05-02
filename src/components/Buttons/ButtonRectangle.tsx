import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { Icon } from '~/components'

type Props = {
  ariaDescription?: string
  ariaPressed?: boolean
  className?: string
  disabled?: boolean
  isDanger?: boolean
  isLoading?: boolean
  isStatusBadge?: boolean
  isSuccess?: boolean
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary' | 'status-badge'
}

export const ButtonRectangle = ({
  ariaDescription,
  ariaPressed,
  className,
  disabled,
  isDanger,
  isLoading,
  isSuccess,
  label,
  onClick,
  type
}: Props) => {
  const buttonClass = classnames(
    'button-rectangle',
    className ? className : '',
    type === 'primary' ? 'primary' : '',
    type === 'secondary' ? 'secondary' : '',
    type === 'tertiary' ? 'tertiary' : '',
    type === 'status-badge' ? 'status-badge' : '',
    isLoading ? 'loading' : '',
    isDanger ? 'danger' : '',
    isSuccess ? 'success' : ''
  )

  const tabIndex = type === 'status-badge' ? -1 : 0

  return (
    <button
      aria-description={ariaDescription}
      aria-pressed={ariaPressed}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {isLoading && <Icon faIcon={faSpinner} spin />}
      <span className='button__text'>{label}</span>
    </button>
  )
}
