import axios from 'axios'
import { alertPremiumRequired, alertRateLimitError, alertSomethingWentWrong } from '~/lib/utility/alerts'
import { PV } from '~/resources'

axios.defaults.withCredentials = true

type PVRequest = {
  body?: any
  endpoint?: string
  headers?: any
  method?: string
  opts?: any
  query?: Record<string, unknown>
  timeout?: number
  url?: string
  withCredentials?: boolean
}

export const request = async (req: PVRequest) => {
  try {
    const { body, endpoint = '', headers, method = 'GET', opts = {}, query = {}, timeout, url, withCredentials } = req

    const queryString = Object.keys(query)
      .map((key) => {
        return `${key}=${query[key]}`
      })
      .join('&')

    const axiosRequest = {
      timeout: timeout || 30000,
      ...(body ? { data: body } : {}),
      ...(headers ? { headers } : {}),
      method,
      ...opts,
      url: url ? url : `${PV.Config.API_BASE_URL}${endpoint}?${queryString}`,
      ...(withCredentials ? { withCredentials: true } : {})
    }

    const response = await axios(axiosRequest)
    return response
  } catch (error) {
    if (error && error.response && error.response.status === 429) {
      alertRateLimitError(error)
    } else {
      throw error
    }
  }
}

export const premiumFeatureRequestErrorHandler = (t: any, error: any) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message === PV.ErrorResponseMessages.premiumRequired
  ) {
    alertPremiumRequired(t)
  } else {
    alertSomethingWentWrong(t)
  }
}
