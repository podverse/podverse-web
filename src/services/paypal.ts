import axios from 'axios'

export const createPayPalOrder = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/paypal/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getPayPalOrderById = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/paypal/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}

export const updatePayPalOrder = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/paypal/order`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
