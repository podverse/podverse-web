import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

export const createBitPayInvoice = async () => {
  return axios(`${API_BASE_URL}/bitpay/invoice`, {
    method: 'post',
    withCredentials: true
  })
}

export const getBitPayInvoiceStatusByOrderId = async (orderId: string) => {
  return axios(`${API_BASE_URL}/bitpay/invoice/${orderId}`, {
    method: 'get',
    withCredentials: true
  })
}
