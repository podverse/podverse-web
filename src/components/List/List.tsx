type Props = {
  children: any
}

export const List = ({ children }: Props) => {
  return (
    <ul className='list'>
      {children}
    </ul>
  )
}
