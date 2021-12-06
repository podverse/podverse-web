import classNames from 'classnames'

type Props = {
  children: any
  noMarginTop?: boolean
}

export const List = ({ children, noMarginTop }: Props) => {
  const listClass = classNames('list', noMarginTop ? 'no-margin-top' : '')
  return <ul className={listClass}>{children}</ul>
}
