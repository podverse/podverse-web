import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { Icon } from '~/components'

type Props = {
  className?: string
  disabled?: boolean
  isDanger?: boolean
  isLoading?: boolean
  isSuccess?: boolean
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary'
}

export const ButtonRectangle = ({ className, disabled, isDanger, isLoading, isSuccess,
  label, onClick, type }: Props) => {
  const buttonClass = classnames(
    'button-rectangle',
    className ? className : '',
    type === 'primary' ? 'primary' : '',
    type === 'secondary' ? 'secondary' : '',
    type === 'tertiary' ? 'tertiary' : '',
    isLoading ? 'loading' : '',
    isDanger ? 'danger' : '',
    isSuccess ? 'success' : ''
  )

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {isLoading && <Icon faIcon={faSpinner} spin />}
      <span className='button__text'>{label}</span>
    </button>
  )
}
