import { Category } from 'podverse-shared'
import { translateCategoryName } from '~/lib/utility/category'

// eslint-disable-next-line
const topLevelCategories = require('~/resources/Categories/TopLevelCategories')

export const getCategories = () => {
  return topLevelCategories
}

export const getTranslatedCategories = () => {
  const translatedCategories = []
  for (const category of topLevelCategories) {
    const translatedCategory = {
      id: category.id,
      slug: category.slug,
      title: translateCategoryName(category.slug)
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
