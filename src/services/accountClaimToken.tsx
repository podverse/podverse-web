import { PV } from '~/resources'
import { request } from './request'

export const getAccountClaimToken = async (id: string) => {
  const endpoint = `${PV.RoutePaths.api.claim_account}/${id}`

  const response = await request({
    endpoint,
    method: 'get'
  })

  return response && response.data
}

export const redeemAccountClaimToken = async (id: string, email: string) => {
  const endpoint = `${PV.RoutePaths.api.claim_account}`

  return request({
    endpoint,
    method: 'post',
    body: {
      id,
      email
    },
    withCredentials: true
  })
}
