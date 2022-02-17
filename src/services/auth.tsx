import axios from 'axios'
import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { PV } from '~/resources'
import { request } from './request'
import { getHistoryItemsFromServer } from './userHistoryItem'
import { getQueueItemsFromServer } from './userQueueItem'

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
      ...getAuthCredentialsHeaders(bearerToken)
    })

    const userInfo = response?.data

    try {
      const { userHistoryItems } = await getHistoryItemsFromServer(1, bearerToken)
      userInfo.historyItems = userHistoryItems || []
  
      const queueItemsResponse = await getQueueItemsFromServer(bearerToken)
      userInfo.queueItems = queueItemsResponse || []
    } catch (err) {
      // If either functions in the try fail, assume the user's membership has expired and fail silently.
      // We let it fail silently here so it doesn't crash the back-end. The UI handles rendering
      // "Renew Membership" messages elsewhere.
    }

    return userInfo
  } catch (error) {
    // console.log('getAuthenticatedUserInfo error', error.message)
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

export const resetPassword = async (password?: string, resetPasswordToken?: string) => {
  return request({
    endpoint: PV.RoutePaths.api.reset_password,
    method: 'post',
    body: {
      password,
      resetPasswordToken
    }
  })
}

export const sendResetPassword = async (email: string) => {
  return request({
    endpoint: PV.RoutePaths.api.send_reset_password,
    method: 'post',
    body: {
      email
    }
  })
}

export const sendVerification = async (email: string) => {
  return request({
    endpoint: PV.RoutePaths.api.send_verification,
    method: 'post',
    body: {
      email
    }
  })
}

export const signUp = async (email: string, password: string) => {
  return request({
    endpoint: PV.RoutePaths.api.sign_up,
    method: 'post',
    body: {
      email,
      password
    },
    withCredentials: true
  })
}

export const verifyEmail = async (token: string) => {
  if (!token) {
    throw new Error('No verification token')
  }

  return request({
    endpoint: PV.RoutePaths.api.verify_email,
    method: 'get',
    query: {
      token
    },
    withCredentials: true
  })
}
