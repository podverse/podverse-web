type TileProps = {
  onClick: () => void
  title: string
}

export const Tile = ({ title, onClick }: TileProps) => {
  return (
    <li aria-label={title} className='tile-box' onClick={onClick} tabIndex={0}>
      <h1 aria-hidden="true" className='tile-box-text'>{title}</h1>
    </li>
  )
}

type TileItem = {
  id: string
  title: string
}

type TilesProps = {
  groupAriaLabel?: string
  items: TileItem[]
  onClick: (id: string) => void
}

export const Tiles = ({ groupAriaLabel, items, onClick }: TilesProps) => {
  const tiles = items.map((item: TileItem) => (
    <Tile key={item.id} onClick={() => onClick(item.id)} title={item.title} />
  ))

  return (
    <ul aria-label={groupAriaLabel} className='tiles'>
      {tiles}
    </ul>
  )
}
