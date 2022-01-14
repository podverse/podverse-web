import classNames from 'classnames'

type Props = {
  children: any
  noPaddingTop?: boolean
}

export const PageScrollableContent = ({ children, noPaddingTop }: Props) => {
  const innerContentClassName = classNames('inner-content main-max-width', noPaddingTop ? 'no-padding-top' : '')

  return (
    <div className='page-scrollable-content'>
      <div className={innerContentClassName}>{children}</div>
    </div>
  )
}

export const scrollToTopOfPageScrollableContent = () => {
  setTimeout(() => {
    const pageEl = document.querySelector('.page-scrollable-content')
    if (pageEl) pageEl.scrollTop = 0
  }, 0)
}
