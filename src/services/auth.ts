import axios from 'axios'

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
  return axios(`http://localhost:3000/api/v1/auth/log-out`, {
    method: 'post',
    withCredentials: true
  })
}
