import classNames from "classnames"

type Props = {
  children?: any
  hideBelowLaptopMaxWidth?: boolean
  hideBelowTabletXLMaxWidth?: boolean
}

export const SideContent = ({ children, hideBelowLaptopMaxWidth, hideBelowTabletXLMaxWidth }: Props) => {
  const sideContentClass = classNames(
    'side-content',
    hideBelowLaptopMaxWidth ? 'hide-below-laptop-max-width' : '',
    hideBelowTabletXLMaxWidth ? 'hide-below-tablet-xl-max-width' : ''
  )
  return <div className={sideContentClass}>{children}</div>
}
