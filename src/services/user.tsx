import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from '~/services/request'

export const getPublicUser = async (id: string) => {
  const response = await request({
    endpoint: `/user/${id}`
  })

  return response && response.data
}

export const getPublicUsersByQuery = async (page: number, userIds: string[]) => {
  const filteredQuery = {
    ...(page ? { page } : { page: 1 }),
    ...(userIds ? { userIds } : {})
  }

  const response = await request({
    endpoint: `/user`,
    query: filteredQuery
  })

  return response && response.data
}

export const updateLoggedInUser = async (data: any) => {
  const response = await request({
    endpoint: '/user',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body: data
  })

  const user = response?.data || {}
  return user
}

export const toggleSubscribeToUserOnServer = async (id: string) => {
  const response = await request({
    endpoint: `/user/toggle-subscribe/${id}`,
    ...getAuthCredentialsHeaders()
  })
  const subscribedUserIds = (response?.data || []) as string[]
  return subscribedUserIds
}
