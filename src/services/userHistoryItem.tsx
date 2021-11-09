import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from './request'

export const getHistoryItemsFromServer = async (page: number, bearerToken?: string) => {
  const response = await request({
    endpoint: PV.RoutePaths.api.user_history_item,
    method: 'get',
    query: {
      page
    },
    ...(getAuthCredentialsHeaders(bearerToken))
  })

  const { userHistoryItems, userHistoryItemsCount } = response.data
  return { userHistoryItems, userHistoryItemsCount }
}
