import axios from 'axios'
import config from '~/config'
import PV from '~/lib/constants'
import { deleteQueryCookies } from '~/lib/utility'
import { getHistoryItemsFromServerWithBearerToken } from './userHistoryItem'
import { getQueueItemsFromServerWithBearerToken } from './userQueueItem'
const { API_BASE_URL } = config()

export const getAuthenticatedUserInfo = async (bearerToken) => {  
  const response = await axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.get_authenticated_user_info}`, {
    method: 'post',
    headers: {
      Authorization: bearerToken
    }
  })

  const userInfo = response && response.data

  const { userHistoryItems } = await getHistoryItemsFromServerWithBearerToken(bearerToken, 1)
  userInfo.historyItems = userHistoryItems || []

  const queueItemsResponse = await getQueueItemsFromServerWithBearerToken(bearerToken)
  userInfo.queueItems = queueItemsResponse || []

  return userInfo
}

export const login = async (email: string, password: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.login}`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const logOut = async () => {
  deleteQueryCookies()
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.logout}`, {
    method: 'post',
    withCredentials: true
  })
}

export const resetPassword = async (password?: string, resetPasswordToken?: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.reset_password}`, {
    method: 'post',
    data: {
      password,
      resetPasswordToken
    }
  })
}

export const sendResetPassword = async (email: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.send_reset_password}`, {
    method: 'post',
    data: {
      email
    }
  })
}

export const sendVerification = async (email: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.send_verification}`, {
    method: 'post',
    data: {
      email
    }
  })
}

export const signUp = async (email: string, password: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.sign_up}`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const verifyEmail = async (token?: string) => {
  return axios.get(`${API_BASE_URL}${PV.paths.api.auth}${PV.paths.api.verify_email}?token=${token}`)
}
