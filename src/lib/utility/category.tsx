// import Link from 'next/link'

// const getLinkCategoryHref = id => {
//   return `/podcasts?categoryId=${id}&refresh=true`
// }

export const generateCategoryNodes = (categories) => {
  const categoryNodes: any[] = []

  if (categories && categories.length > 0) {
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const categoryText = category.title
      // const categoryHref = getLinkCategoryHref(category.id)

      categoryNodes.push(
        <span key={`category-${i}`}>
          {/* <Link
            href={categoryHref}> */}
            <a>{categoryText}</a>
          {/* </Link> */}
          {i < categories.length - 1 && (<span>,</span>)}
        </span>
      )
    }
  }

  return categoryNodes
}
