type TileProps = {
  onClick: () => void
  title: string
}

export const Tile = ({ title, onClick }: TileProps) => {
  return (
    <div
      className='tile-box'
      onClick={onClick}
    >
      <h1 className='tile-box-text'>{title}</h1>
    </div>
  )
}

type TileItem = {
  id: string
  title: string
}

type TilesProps = {
  items: TileItem[]
  onClick: (id: string) => void
}

export const Tiles = ({ items, onClick }: TilesProps) => {
  const tiles = items.map((item: TileItem) => <Tile onClick={() => onClick(item.id)} title={item.title} />)

  return (
    <div
      className='tiles'
    >
      {tiles}
    </div>
  )
}
