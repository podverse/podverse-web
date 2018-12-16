import axios from 'axios'
import { NowPlayingItem } from 'lib/nowPlayingItem'

export const addOrUpdateUserHistoryItem = async (nowPlayingItem: NowPlayingItem) => {
  return axios(`http://localhost:3000/api/v1/user/add-or-update-history-item`, {
    method: 'patch',
    data: {
      historyItem: nowPlayingItem
    },
    withCredentials: true
  })
}

export const deleteUser = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/user/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}


export const downloadUserData = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/user/download/${id}`, {
    method: 'get',
    withCredentials: true
  })
}

export const updateUser = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/user`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const updateUserQueueItems = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/user/update-queue`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
