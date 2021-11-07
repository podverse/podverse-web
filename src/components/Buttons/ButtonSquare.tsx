import classnames from 'classnames'

type Props = {
  isActive?: boolean
  onClick?: any
  text?: string | number
}

export const ButtonSquare = ({ isActive, onClick, text }: Props) => {
  const wrapperClass = classnames(
    'button-square',
    { 'active': isActive }
  )

  return (
    <button
      className={wrapperClass}
      onClick={onClick}>
      {text}
    </button>
  )
}
