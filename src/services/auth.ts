import axios from 'axios'
import { deleteCookie } from '~/lib/utility';

export const login = async (email: string, password: string) => {
  return axios(`http://localhost:3000/api/v1/auth/login`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const logOut = async () => {
  deleteCookie('userId')
  return axios(`http://localhost:3000/api/v1/auth/log-out`, {
    method: 'post',
    withCredentials: true
  })
}

export const resetPassword = async (password?: string, resetPasswordToken?: string) => {
  return axios(`http://localhost:3000/api/v1/auth/reset-password`, {
    method: 'post',
    data: {
      password,
      resetPasswordToken
    }
  })
}

export const sendResetPassword = async (email: string) => {
  return axios(`http://localhost:3000/api/v1/auth/send-reset-password`, {
    method: 'post',
    data: {
      email
    }
  })
}

export const signUp = async (email: string, password: string) => {
  return axios(`http://localhost:3000/api/v1/auth/sign-up`, {
    method: 'post',
    data: {
      email,
      password
    },
    withCredentials: true
  })
}

export const verifyEmail = async (token?: string) => {
  return axios.get(`http://localhost:3000/api/v1/auth/verify-email?token=${token}`)
}
