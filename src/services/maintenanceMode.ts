import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

/* If the API is in maintenance mode, any request will return a 503 error */
export const checkIfInMaintenanceMode = async () => {
  return axios.get(`${API_BASE_URL}`)
}
