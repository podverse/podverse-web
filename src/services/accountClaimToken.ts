import axios from 'axios'
import config from '~/config'
import PV from '~/lib/constants'
const { API_BASE_URL } = config()

export const getAccountClaimToken = async (id: string) => {
  return axios.get(`${API_BASE_URL}${PV.paths.api.claim_account}/${id}`)
}

export const redeemAccountClaimToken = async (id: string, email: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.claim_account}`, {
    method: 'post',
    data: { id, email }
  })
}
