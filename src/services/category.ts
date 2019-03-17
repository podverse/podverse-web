import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

export const getCategoriesByQuery = async (query: CategoryQuery) => {
  return axios.get(`${API_BASE_URL}/category`)
}

type CategoryQuery = {
  id?: string
  slug?: string
  title?: string
}
