import classNames from 'classnames'

type Props = {
  children: any
  className?: string
  onClick?: any
  role?: 'button' | ''
}

export const DivClickable = ({ children, className, onClick, role }: Props) => {
  const wrapperClass = classNames(className ? className : '')

  const _handleOnKeyPress = (event: any) => {
    if (event.code === 'Enter') {
      onClick()
    }
  }

  return (
    <div
      className={wrapperClass}
      {...(onClick ? { onKeyPress: _handleOnKeyPress } : {})}
      {...(onClick ? { onClick } : {})}
      {...(onClick ? { tabIndex: 0 } : {})}
      {...(role ? { role } : {})}
    >
      {children}
    </div>
  )
}
