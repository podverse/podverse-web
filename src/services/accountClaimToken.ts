import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

export const getAccountClaimToken = async (id: string) => {
  return axios.get(`${API_BASE_URL}/claim-account/${id}`)
}

export const redeemAccountClaimToken = async (id: string, email: string) => {
  return axios(`${API_BASE_URL}/claim-account`, {
    method: 'post',
    data: { id, email }
  })
}
