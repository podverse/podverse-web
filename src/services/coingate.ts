import axios from 'axios'
import { API_BASE_URL } from '~/config'

export const createCoingateOrder = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/coingate/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getCoingateOrderById = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/coingate/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
