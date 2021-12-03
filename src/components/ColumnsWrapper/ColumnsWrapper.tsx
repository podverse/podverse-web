type Props = {
  mainColumnChildren: any
  sideColumnChildren?: any
}

export const ColumnsWrapper = ({ mainColumnChildren, sideColumnChildren }: Props) => {
  return (
    <div className='row'>
      <div className='column flex-stretch'>{mainColumnChildren}</div>
      <div className='column'>{sideColumnChildren}</div>
    </div>
  )
}
