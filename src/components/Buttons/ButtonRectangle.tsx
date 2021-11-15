import classnames from 'classnames'

type Props = {
  disabled?: boolean
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary'
  isLoading?: boolean
}

export const ButtonRectangle = ({ disabled, label, onClick, type, isLoading }: Props) => {
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
      <span className="button__text">
        {label}
      </span>
    </button>
  )
}