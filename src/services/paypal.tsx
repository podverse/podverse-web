import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { PV } from '~/resources'
import { request } from '~/services/request'

export const createPayPalOrder = async (body: any) => {
  return request({
    endpoint: PV.RoutePaths.api.paypalOrder,
    method: 'post',
    body,
    ...getAuthCredentialsHeaders()
  })
}

export const getPayPalOrderById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.paypalOrder}/${id}`,
    method: 'get',
    ...getAuthCredentialsHeaders()
  })
}
