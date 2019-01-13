import axios from 'axios'
import { API_BASE_URL } from '~/config'

export const createBitPayInvoice = async () => {
  return axios(`${API_BASE_URL}/api/v1/bitpay/invoice`, {
    method: 'post',
    withCredentials: true
  })
}

export const getBitPayInvoiceStatusByOrderId = async (orderId: string) => {
  return axios(`${API_BASE_URL}/api/v1/bitpay/invoice/${orderId}`, {
    method: 'get',
    withCredentials: true
  })
}
