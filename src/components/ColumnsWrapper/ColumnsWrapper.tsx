type Props = {
  mainColumnChildren: any
  sideColumnChildren?: any
}

export const ColumnsWrapper = ({ mainColumnChildren, sideColumnChildren }: Props) => {
  return (
    <div className='columns-wrapper'>
      <div className='columns-wrapper-main'>{mainColumnChildren}</div>
      <div className='columns-wrapper-side'>{sideColumnChildren}</div>
    </div>
  )
}
