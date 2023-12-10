type Props = {
  centerContent?: boolean
  mainColumnChildren: any
  sideColumnChildren?: any
}

export const ColumnsWrapper = ({ centerContent, mainColumnChildren, sideColumnChildren }: Props) => {
  const mainClass = centerContent ? `columns-wrapper-main flex-centered-content-wrapper` : 'columns-wrapper-main'
  return (
    <div className='columns-wrapper'>
      {sideColumnChildren && <div className='columns-wrapper-side'>{sideColumnChildren}</div>}
      <div className={mainClass}>{mainColumnChildren}</div>
    </div>
  )
}
