import { Category } from 'podverse-shared'

// eslint-disable-next-line
const topLevelCategories = require('~/resources/Categories/TopLevelCategories')

export const getCategories = () => {
  return topLevelCategories
}

export const getTranslatedCategories = (t: any) => {
  const translatedCategories = []
  for (const category of topLevelCategories) {
    const translatedCategory = {
      id: category.id,
      slug: category.slug,
      title: t(`category - ${category.slug}`)
    }
    translatedCategories.push(translatedCategory)
  }
  return translatedCategories
}

export const getCategoryById = (id: string) => {
  const categories = getCategories()
  const category = categories.find((category: Category) => category.id === id)
  return category
}

export const getCategoryBySlug = (slug: string) => {
  const categories = getCategories()
  const category = categories.find((category: Category) => category.slug === slug)
  return category
}
