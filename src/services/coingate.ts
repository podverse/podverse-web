import axios from 'axios'

export const createCoingateOrder = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/coingate/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getCoingateOrderById = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/coingate/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
