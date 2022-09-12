import { useTranslation } from 'next-i18next'
// import Link from 'next/link'

// const getLinkCategoryHref = id => {
//   return `/podcasts?categoryId=${id}&refresh=true`
// }

export const translateCategoryName = name => {
  const { t } = useTranslation()
  const translatedName = t(`category - ${name.toLowerCase()}`)

  return translatedName.startsWith('category - ') ? name : translatedName
}

export const generateCategoryNodes = (categories) => {
  const categoryNodes: any[] = []

  if (categories && categories.length > 0) {
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const categoryText = translateCategoryName(category.title)
      // const categoryHref = getLinkCategoryHref(category.id)

      categoryNodes.push(
        <span key={`category-${i}`}>
          {/* <Link
            href={categoryHref}> */}
          <a>{categoryText}</a>
          {/* </Link> */}
          {i < categories.length - 1 && <span>, </span>}
        </span>
      )
    }
  }

  return categoryNodes
}
