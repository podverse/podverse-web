import axios from 'axios'
import config from '~/config'
import { NowPlayingItem } from '~/lib/nowPlayingItem'
import { convertObjectToQueryString } from '~/lib/utility'
const { API_BASE_URL } = config()

export const getAuthenticatedUserInfo = async (bearerToken) => {
  return axios(`${API_BASE_URL}/auth/get-authenticated-user-info`, {
    method: 'post',
    headers: {
      Authorization: bearerToken
    }
  })
}

export const login = async (email: string, password: string) => {
  return axios(`${API_BASE_URL}/auth/login`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const logOut = async () => {
  return axios(`${API_BASE_URL}/auth/logout`, {
    method: 'post',
    withCredentials: true
  })
}

export const getLoggedInUserMediaRefs = async (bearerToken, nsfwMode, sort = 'most-recent', page = 1) => {
  let filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/auth/mediaRefs?${queryString}`, {
    method: 'get',
    headers: {
      Authorization: bearerToken,
      nsfwMode
    },
    withCredentials: true
  })
}

export const getLoggedInUserPlaylists = async (bearerToken, page = 1) => {
  let filteredQuery: any = {}
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/auth/playlists?${queryString}`, {
    method: 'get',
    data: {
      page
    },
    headers: {
      Authorization: bearerToken
    },
    withCredentials: true
  })
}

export const resetPassword = async (password?: string, resetPasswordToken?: string) => {
  return axios(`${API_BASE_URL}/auth/reset-password`, {
    method: 'post',
    data: {
      password,
      resetPasswordToken
    }
  })
}

export const sendResetPassword = async (email: string) => {
  return axios(`${API_BASE_URL}/auth/send-reset-password`, {
    method: 'post',
    data: {
      email
    }
  })
}

export const signUp = async (email: string, password: string) => {
  return axios(`${API_BASE_URL}/auth/sign-up`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const deleteLoggedInUser = async (id: string) => {
  return axios(`${API_BASE_URL}/auth/user`, {
    method: 'delete',
    withCredentials: true
  })
}

export const updateLoggedInUser = async (data: any) => {
  return axios(`${API_BASE_URL}/auth/user`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const addOrUpdateUserHistoryItem = async (nowPlayingItem: NowPlayingItem) => {
  return axios(`${API_BASE_URL}/auth/user/add-or-update-history-item`, {
    method: 'patch',
    data: {
      historyItem: nowPlayingItem
    },
    withCredentials: true
  })
}

export const downloadLoggedInUserData = async (id: string) => {
  return axios(`${API_BASE_URL}/auth/user/download`, {
    method: 'get',
    withCredentials: true
  })
}

export const updateUserQueueItems = async (data: any) => {
  return axios(`${API_BASE_URL}/auth/user/update-queue`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const verifyEmail = async (token?: string) => {
  return axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}`)
}
