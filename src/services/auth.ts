import axios from 'axios'
import { API_BASE_URL } from '~/config'
import { alertIfRateLimitError, convertObjectToQueryString } from '~/lib/utility'

export const getAuthenticatedUserInfo = async (bearerToken) => {
  return axios(`${API_BASE_URL}/auth/get-authenticated-user-info`, {
    method: 'post',
    headers: {
      Authorization: bearerToken
    }
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

export const getLoggedInUserPlaylists = async (bearerToken, sort = 'alphabetical', page = 1) => {
  let filteredQuery: any = {}
  filteredQuery.sort = sort
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

export const login = async (email: string, password: string) => {
  return axios(`${API_BASE_URL}/auth/login`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
  .catch(err => {
    if (err && err.response && err.response.data.message === 429) {
      alertIfRateLimitError(err)
      return
    }
    throw err
  })
}

export const logOut = async () => {
  return axios(`${API_BASE_URL}/auth/log-out`, {
    method: 'post',
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
  .catch(err => {
    if (err && err.response && err.response.data.message === 429) {
      alertIfRateLimitError(err)
      return
    }
    throw err
  })
}

export const sendResetPassword = async (email: string) => {
  return axios(`${API_BASE_URL}/auth/send-reset-password`, {
    method: 'post',
    data: {
      email
    }
  })
  .catch(err => {
    if (err && err.response && err.response.data.message === 429) {
      alertIfRateLimitError(err)
      return
    }
    throw err
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

export const verifyEmail = async (token?: string) => {
  return axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}`)
    .catch(err => {
      if (err && err.response && err.response.data.message === 429) {
        alertIfRateLimitError(err)
        return
      }
      throw err
    })
}
