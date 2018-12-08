import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'

export const addOrRemovePlaylistItem = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/playlist/add-or-remove`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const createPlaylist = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/playlist`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const deletePlaylist = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/playlist/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const getPlaylistById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/playlist/${id}`)
}

export const getPlaylistsByQuery = async (query) => {
  let filteredQuery: any = {}

  if (query.from === 'subscribed-only') {
    filteredQuery.playlistId = query.subscribedPlaylistIds
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios.get(`http://localhost:3000/api/v1/playlist?${queryString}`)
}

export const toggleSubscribeToPlaylist = async (playlistId: string) => {
  return axios(`http://localhost:3000/api/v1/playlist/toggle-subscribe/${playlistId}`, {
    method: 'get',
    withCredentials: true
  })
}

export const updatePlaylist = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/playlist`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
