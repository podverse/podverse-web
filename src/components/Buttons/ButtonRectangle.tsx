import classnames from 'classnames'

type Props = {
  disabled?: boolean
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary'
}

export const ButtonRectangle = ({ disabled, label, onClick, type }: Props) => {
  const buttonClass = classnames(
    'button-rectangle',
    type === 'primary' ? 'primary' : '',
    type === 'secondary' ? 'secondary' : '',
    type === 'tertiary' ? 'tertiary' : ''
  )

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}>
      {label}
    </button>
  )
}