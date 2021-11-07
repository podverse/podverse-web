import classnames from 'classnames'

type Props = {
  isActive?: boolean
  text?: string | number
}

export const ButtonSquare = ({ isActive, text }: Props) => {
  const wrapperClass = classnames(
    'button-square',
    { 'active': isActive }
  )

  return (
    <button className={wrapperClass}>
      {text}
    </button>
  )
}
