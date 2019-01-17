import axios from 'axios'
import { API_BASE_URL } from '~/config'
import { NowPlayingItem } from 'lib/nowPlayingItem'
import { alertIfRateLimitError, convertObjectToQueryString } from '~/lib/utility'

export const addOrUpdateUserHistoryItem = async (nowPlayingItem: NowPlayingItem) => {
  return axios(`${API_BASE_URL}/api/v1/user/add-or-update-history-item`, {
    method: 'patch',
    data: {
      historyItem: nowPlayingItem
    },
    withCredentials: true
  })
}

export const deleteUser = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/user/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const downloadUserData = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/user/download/${id}`, {
    method: 'get',
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

export const getPublicUser = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/user/${id}`, {
    method: 'get'
  })
}

export const getUserMediaRefs = async (
  id: string,
  nsfwMode: string = 'on',
  sort: string = 'most-recent',
  page: number = 1
) => {
  let filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/api/v1/user/${id}/mediaRefs?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
}

export const getUserPlaylists = async (
  id: string,
  sort: string = 'alphabetical',
  page: number = 1
) => {
  let filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/api/v1/user/${id}/playlists?${queryString}`, {
    method: 'get'
  })
}

export const getPublicUsersByQuery = async query => {
  let filteredQuery: any = {}

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.userIds) {
    filteredQuery.userIds = query.userIds
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}/api/v1/user?${queryString}`, {
    method: 'get'
  })
}

export const toggleSubscribeToUser = async (userId: string) => {
  return axios(`${API_BASE_URL}/api/v1/user/toggle-subscribe/${userId}`, {
    method: 'get',
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

export const updateUser = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/user`, {
    method: 'patch',
    data,
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

export const updateUserQueueItems = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/user/update-queue`, {
    method: 'patch',
    data,
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
