import classNames from "classnames"

type Props = {
  children: any
  noMarginTop?: boolean
}

export const PageScrollableContent = ({ children, noMarginTop }: Props) => {
  const innerContentClassName = classNames(
    'inner-content main-max-width',
    noMarginTop ? 'no-margin-top' : ''
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
