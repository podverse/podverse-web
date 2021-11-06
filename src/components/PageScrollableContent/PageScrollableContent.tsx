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
