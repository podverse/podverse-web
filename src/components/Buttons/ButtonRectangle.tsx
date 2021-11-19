import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { Icon } from '~/components'

type Props = {
  disabled?: boolean
  isLoading?: boolean
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary'
}

export const ButtonRectangle = ({ disabled, isLoading, label, onClick, type }: Props) => {
  const buttonClass = classnames(
    'button-rectangle',
    type === 'primary' ? 'primary' : '',
    type === 'secondary' ? 'secondary' : '',
    type === 'tertiary' ? 'tertiary' : '',
    isLoading ? 'loading' : '',
  )

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}>
      {isLoading && <Icon faIcon={faSpinner} spin />}
      {
        !isLoading && (
          <span className="button__text">
            {label}
          </span>
        )
      }
    </button>
  )
}