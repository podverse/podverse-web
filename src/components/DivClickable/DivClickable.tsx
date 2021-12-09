import classNames from 'classnames'

type Props = {
  children: any
  className?: string
  onClick?: any
}

export const DivClickable = ({ children, className, onClick }: Props) => {
  const wrapperClass = classNames(className ? className : '')

  const _handleOnKeyPress = (event: any) => {
    if (event.code === "Enter") {
      onClick()
    }
  }

  return (
    <div className={wrapperClass}
      {...(onClick ? { onKeyPress: _handleOnKeyPress } : {})}
      {...(onClick ? { onClick } : {})}
      {...(onClick ? { tabIndex: 0 } : {})}>
      {children}
    </div>
  )
}
