import axios from 'axios'

export const getCategoriesByQuery = async (query: CategoryQuery) => {
  return axios.get(`http://localhost:3000/api/v1/category`)
}

type CategoryQuery = {
  id?: string
  slug?: string
  title?: string
  category?: string
}
