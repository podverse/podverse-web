import axios from 'axios'
import { PV } from '~/resources'

axios.defaults.withCredentials = true

type PVRequest = {
  body?: any
  endpoint?: string
  headers?: any
  method?: string
  opts?: any
  query?: {}
  withCredentials?: boolean
}

export const request = async (req: PVRequest) => {
  const { body, endpoint = '', headers, method = 'GET', opts = {}, query = {}, withCredentials } = req

  const queryString = Object.keys(query)
    .map((key) => {
      return `${key}=${query[key]}`
    })
    .join('&')

  const axiosRequest = {
    ...(body ? { data: body } : {}),
    ...(headers ? { headers } : {}),
    method,
    ...opts,
    timeout: 30000,
    url: `${PV.Config.API_BASE_URL}${endpoint}?${queryString}`,
    ...(withCredentials ? { withCredentials: true } : {})
  }

  try {
    const response = await axios(axiosRequest)
    return response
  } catch (error) {
    throw error
  }
}
