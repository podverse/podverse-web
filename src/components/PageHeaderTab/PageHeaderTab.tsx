import classNames from "classnames"

type Props = {
  isActive?: boolean
  label: string
  onClick: any
}

export const PageHeaderTab = ({ isActive, label, onClick }: Props) => {
  const tabStyle = classNames(
    'page-header-tab',
    isActive ? 'active' : ''
  )

  return (
    <div
      className={tabStyle}
      onClick={onClick}
      tabIndex={0}>
      {label}
    </div>
  )
}
