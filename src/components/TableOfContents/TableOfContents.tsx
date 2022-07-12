type Props = {
  items: any[]
}

type TableOfContentsItemProps = {
  id: string
  title: string
}

const TableOfContentsItem = ({ id, title }: TableOfContentsItemProps) => {
  return (
    <li>
      <a href={`#${id}`}>{title}</a>
    </li>
  )
}

export const TableOfContents = ({ items }: Props) => {
  const generateTOCElements = () => {
    return items.map((item, index) => (
      <TableOfContentsItem id={item.id} key={`table-of-contents-item-${index}`} title={item.title} />
    ))
  }

  return <div className='table-of-contents'>{generateTOCElements()}</div>
}
