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