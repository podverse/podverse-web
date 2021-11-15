type Props = {
  children: any
}

export const PageScrollableContent = ({ children }: Props) => {
  return (
    <div className='page-scrollable-content'>
      <div className='inner-content main-max-width'>
        {children}
      </div>
    </div>
  )
}

export const scrollToTopOfPageScrollableContent = () => {
  const pageEl = document.querySelector('.page-scrollable-content')
  if (pageEl) pageEl.scrollTop = 0
}
