import axios from 'axios'

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

export const getPlaylistById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/playlist/${id}`)
}

export const toggleSubscribeToPlaylist = async (playlistId: string) => {
  return axios(`http://localhost:3000/api/v1/playlist/toggle-subscribe/${playlistId}`, {
    method: 'get',
    withCredentials: true
  })
}
