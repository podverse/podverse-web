import axios from 'axios'
import config from '~/config'
import PV from '~/lib/constants'
const { API_BASE_URL } = config()

export const getCategoriesByQuery = async (query: CategoryQuery) => {
  return axios.get(`${API_BASE_URL}${PV.paths.api.category}`)
}

type CategoryQuery = {
  id?: string
  slug?: string
  title?: string
}
