import classNames from "classnames"

type Props = {
  children: any
}

export const PageScrollableContent = ({ children }: Props) => {
  const innerContentClassName = classNames(
    'inner-content main-max-width'
  )

  return (
    <div className='page-scrollable-content'>
      <div className={innerContentClassName}>
        {children}
      </div>
    </div>
  )
}

export const scrollToTopOfPageScrollableContent = () => {
  const pageEl = document.querySelector('.page-scrollable-content')
  if (pageEl) pageEl.scrollTop = 0
}
