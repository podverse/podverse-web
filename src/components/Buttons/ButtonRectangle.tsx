import classnames from 'classnames'

type Props = {
  label: string
  onClick?: any
  type: 'primary' | 'secondary' | 'tertiary'
}

export const ButtonRectangle = ({ label, onClick, type }: Props) => {
  const buttonClass = classnames(
    'button-rectangle',
    type === 'primary' ? 'primary' : '',
    type === 'secondary' ? 'secondary' : '',
    type === 'tertiary' ? 'tertiary' : ''
  )

  return (
    <button
      className={buttonClass}
      onClick={onClick}>
      {label}
    </button>
  )
}