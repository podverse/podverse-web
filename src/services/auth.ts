import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

export const getAuthenticatedUserInfo = async (bearerToken) => {
  const response = await axios(`${API_BASE_URL}/auth/get-authenticated-user-info`, {
    method: 'post',
    headers: {
      Authorization: bearerToken
    }
  })

  const userInfo = response && response.data
  if (userInfo && !Array.isArray(userInfo.historyItems)) {
    userInfo.historyItems = []
  }

  return userInfo
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

export const sendVerification = async (email: string) => {
  return axios(`${API_BASE_URL}/auth/send-verification`, {
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

export const verifyEmail = async (token?: string) => {
  return axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}`)
}
