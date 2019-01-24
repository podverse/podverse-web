import axios from 'axios'
import { alertIfRateLimitError } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const createBitPayInvoice = async () => {
  return axios(`${API_BASE_URL}/bitpay/invoice`, {
    method: 'post',
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

export const getBitPayInvoiceStatusByOrderId = async (orderId: string) => {
  return axios(`${API_BASE_URL}/bitpay/invoice/${orderId}`, {
    method: 'get',
    withCredentials: true
  })
}
