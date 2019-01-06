import axios from 'axios'
import { API_BASE_URL } from '~/config'

export const createPayPalOrder = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/paypal/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getPayPalOrderById = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/paypal/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
