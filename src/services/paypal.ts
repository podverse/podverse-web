import axios from 'axios'
import { API_BASE_URL } from '~/config'
import { alertIfRateLimitError } from '~/lib/utility'

export const createPayPalOrder = async (data: any) => {
  return axios(`${API_BASE_URL}/paypal/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
  .catch(err => {
    if (err && err.response && err.response.data.message === 429) {
      alertIfRateLimitError(err)
      return
    }
    throw err
  })
}

export const getPayPalOrderById = async (id: string) => {
  return axios(`${API_BASE_URL}/paypal/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
