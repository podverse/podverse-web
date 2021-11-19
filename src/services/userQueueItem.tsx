import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from './request'

export const getServerSideUserQueueItems = async (cookies: any) => {
  let userInfo = null
  if (cookies.Authorization) {
    userInfo = await getQueueItemsFromServer(cookies.Authorization)
  }
  return userInfo
}

export const getQueueItemsFromServer = async (bearerToken?: string) => {
  let response = {
    data: {
      userQueueItems: []
    }
  }

  try {
    response = await request({
      endpoint: PV.RoutePaths.api.user_queue_item,
      method: 'get',
      ...(getAuthCredentialsHeaders(bearerToken))
    })
  } catch (error) {
    console.log('getQueueItemsFromServer', error)
  }

  return response?.data?.userQueueItems || []
}

export const removeQueueItemEpisodeFromServer = async (episodeId: string) => {
  const response = await request({
    endpoint: `/user-queue-item/episode/${episodeId}`,
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })
  return response?.data?.userQueueItems || []
}

export const removeQueueItemMediaRefFromServer = async (mediaRefId: string) => {
  const response = await request({
    endpoint: `/user-queue-item/mediaRef/${mediaRefId}`,
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })
  return response?.data?.userQueueItems || []
}

export const removeQueueItemsAllFromServer = async () => {
  await request({
    endpoint: `/user-queue-item/remove-all`,
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })
  return []
}
