import axios from 'axios'
import { sfwFilterMediaRefs, sfwFilterPlaylists, sfwFilterUser, sfwFilterUsers
  } from '~/lib/profanityFilter'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const getPublicUser = async (id: string, nsfwMode = 'on') => {
  return axios(`${API_BASE_URL}/user/${id}`, {
    method: 'get'
  })
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterUser(result.data) }
  })
}

export const getUserMediaRefs = async (
  id: string,
  nsfwMode: string = 'on',
  sort: string = 'most-recent',
  page
) => {
  let filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/user/${id}/mediaRefs?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterMediaRefs(result.data) }
  })
}

export const getUserPlaylists = async (
  id: string,
  nsfwMode: string = 'on',
  page
) => {
  let filteredQuery: any = {}
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}/user/${id}/playlists?${queryString}`, {
    method: 'get'
  })
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterPlaylists(result.data) }
  })
}

export const getPublicUsersByQuery = async (query, nsfwMode = 'on') => {
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
  return axios(`${API_BASE_URL}/user?${queryString}`, {
    method: 'get'
  })
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterUsers(result.data) }
  })
}

export const toggleSubscribeToUser = async (userId: string) => {
  return axios(`${API_BASE_URL}/user/toggle-subscribe/${userId}`, {
    method: 'get',
    withCredentials: true
  })
}
