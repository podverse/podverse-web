import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from './request'

export const getQueueItemsFromServer = async (bearerToken?: string) => {
  const response = await request({
    endpoint: PV.RoutePaths.api.user_queue_item,
    method: 'get',
    ...(getAuthCredentialsHeaders(bearerToken))
  })

  const userQueueItems = response && response.data && response.data.userQueueItems
  return userQueueItems
}
