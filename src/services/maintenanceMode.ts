import axios from 'axios'
import config from '~/config'
const { API_BASE_URL, CHECK_FOR_MAINTENANCE_MODE } = config()

/* If the API is in maintenance mode, any request will return a 503 error */
export const checkIfInMaintenanceMode = async () => {
  if (CHECK_FOR_MAINTENANCE_MODE) {
    return axios.get(`${API_BASE_URL}`)
  }
  return false
}
