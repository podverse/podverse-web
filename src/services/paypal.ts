import axios from 'axios'
import config from '~/config'
import PV from '~/lib/constants'
const { API_BASE_URL } = config()

export const createPayPalOrder = async (data: any) => {
  return axios(`${API_BASE_URL}${PV.paths.api.paypal}${PV.paths.api.order}`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getPayPalOrderById = async (id: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.paypal}${PV.paths.api.order}/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
