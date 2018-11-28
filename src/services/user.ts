import axios from 'axios'

export const updateUserQueueItems = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/user/update-queue`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}