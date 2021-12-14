type Props = {
  title: string
  onClick: () => void
}

export const Tile = ({ title, onClick }: Props) => {
  return (
    <div
      className='tile-box'
      onClick={onClick}
    >
      <h1 className='tile-box-text'>{title}</h1>
    </div>
  )
}
