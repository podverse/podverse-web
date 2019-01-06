import axios from 'axios'
import { API_BASE_URL } from '~/config'

export const getCategoriesByQuery = async (query: CategoryQuery) => {
  return axios.get(`${API_BASE_URL}/api/v1/category`)
}

type CategoryQuery = {
  id?: string
  slug?: string
  title?: string
  category?: string
}
