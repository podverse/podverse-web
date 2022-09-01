import { useTranslation } from 'next-i18next'

type Props = {
  sections: any[]
}

type TableOfContentsItemProps = {
  section: any
}

const TableOfContentsSection = ({ section }: TableOfContentsItemProps) => {
  const sectionItems = section?.sectionItems?.map((item) => {
    return (
      <li key={`#${item.id}`}>
        <a href={`#${item.id}`}>{item.title}</a>
      </li>
    )
  })

  return (
    <li>
      <div className='section-title'>{section.sectionTitle}</div>
      <ul>{sectionItems}</ul>
    </li>
  )
}

export const TableOfContents = ({ sections }: Props) => {
  const { t } = useTranslation()

  const generateTOCSections = () => {
    return sections.map((section) => {
      return <TableOfContentsSection key={section.sectionTitle} section={section} />
    })
  }

  return (
    <div className='table-of-contents'>
      <h2>{t('Table of Contents')}</h2>
      <ul>{generateTOCSections()}</ul>
    </div>
  )
}
