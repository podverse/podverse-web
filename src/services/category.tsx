import { Category } from "podverse-shared"

const topLevelCategories = require('~/resources/Categories/TopLevelCategories')

export const getCategories = () => {
  return topLevelCategories
}

export const getCategoryById = (id: string) => {
  const categories = getCategories()[0]
  const category = categories.find((category: Category) => category.id === id)
  return category
}
