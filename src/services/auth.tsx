import axios from "axios"
import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from './request'
import { getHistoryItemsFromServer } from "./userHistoryItem"
import { getQueueItemsFromServer } from "./userQueueItem"

export const getServerSideAuthenticatedUserInfo = async (cookies: any) => {
  let userInfo = null
  if (cookies.Authorization) {
    userInfo = await getAuthenticatedUserInfo(cookies.Authorization)
  }
  return userInfo
}

export const getAuthenticatedUserInfo = async (bearerToken?: string) => {
  try {
    const response = await request({
      endpoint: PV.RoutePaths.api.get_authenticated_user_info,
      method: 'post',
      ...(getAuthCredentialsHeaders(bearerToken))
    })

    const userInfo = response?.data

    const { userHistoryItems } = await getHistoryItemsFromServer(1, bearerToken)
    userInfo.historyItems = userHistoryItems || []

    const queueItemsResponse = await getQueueItemsFromServer(bearerToken)
    userInfo.queueItems = queueItemsResponse || []

    return userInfo
  } catch (error) {
    console.log('getAuthenticatedUserInfo error', error.message)
  }
}

export const login = async (email: string, password: string) => {
  return axios(`${PV.Config.API_BASE_URL}${PV.RoutePaths.api.login}`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const logOut = async () => {
  await request({
    endpoint: PV.RoutePaths.api.logout,
    method: 'post',
    withCredentials: true
  })
  window.location.reload()
}
