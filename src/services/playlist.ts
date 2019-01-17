import axios from 'axios'
import { API_BASE_URL } from '~/config'
import { alertIfRateLimitError, convertObjectToQueryString } from '~/lib/utility'

export const addOrRemovePlaylistItem = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/playlist/add-or-remove`, {
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

export const createPlaylist = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/playlist`, {
    method: 'post',
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

export const deletePlaylist = async (id: string) => {
  return axios(`${API_BASE_URL}/api/v1/playlist/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const getPlaylistById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/api/v1/playlist/${id}`)
}

export const getPlaylistsByQuery = async (query) => {
  let filteredQuery: any = {}

  if (query.from === 'subscribed-only') {
    filteredQuery.playlistId = query.subscribedPlaylistIds
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios.get(`${API_BASE_URL}/api/v1/playlist?${queryString}`)
}

export const toggleSubscribeToPlaylist = async (playlistId: string) => {
  return axios(`${API_BASE_URL}/api/v1/playlist/toggle-subscribe/${playlistId}`, {
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

export const updatePlaylist = async (data: any) => {
  return axios(`${API_BASE_URL}/api/v1/playlist`, {
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
