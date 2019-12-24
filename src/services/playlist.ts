import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const addOrRemovePlaylistItem = async (data: any) => {
  return axios(`${API_BASE_URL}/playlist/add-or-remove`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const createPlaylist = async (data: any) => {
  return axios(`${API_BASE_URL}/playlist`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const deletePlaylist = async (id: string) => {
  return axios(`${API_BASE_URL}/playlist/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const getPlaylistById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/playlist/${id}`)
}

export const getPlaylistsByQuery = async (query) => {
  const filteredQuery: any = {}

  if (query.from === 'subscribed-only') {
    filteredQuery.playlistId = query.subscribedPlaylistIds
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios.get(`${API_BASE_URL}/playlist?${queryString}`)
}

export const toggleSubscribeToPlaylist = async (playlistId: string) => {
  return axios(`${API_BASE_URL}/playlist/toggle-subscribe/${playlistId}`, {
    method: 'get',
    withCredentials: true
  })
}

export const updatePlaylist = async (data: any) => {
  return axios(`${API_BASE_URL}/playlist`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
