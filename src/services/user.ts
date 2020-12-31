import axios from 'axios'
import PV from '~/lib/constants'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const getPublicUser = async (id: string) => {
  return axios(`${API_BASE_URL}/user/${id}`, {
    method: 'get'
  })
}

export const getUserMediaRefs = async (
  id: string,
  sort = 'most-recent',
  page
) => {
  const filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}/${id}${PV.paths.api.mediaRefs}?${queryString}`, {
    method: 'get'
  })
}

export const getUserPlaylists = async (
  id: string,
  page
) => {
  const filteredQuery: any = {}
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}/${id}${PV.paths.api.playlists}?${queryString}`, {
    method: 'get'
  })
}

export const getPublicUsersByQuery = async (query) => {
  const filteredQuery: any = {}

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.userIds) {
    filteredQuery.userIds = query.userIds
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}${PV.paths.api.user}?${queryString}`, {
    method: 'get'
  })
}

export const toggleSubscribeToUser = async (userId: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.toggle_subscribe}/${userId}`, {
    method: 'get',
    withCredentials: true
  })
}


export const getLoggedInUserMediaRefsFromFrontEnd = async (sort = PV.queryParams.most_recent, page = 1) => {
  const filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.mediaRefs}?${queryString}`, {
    method: 'get',
    withCredentials: true
  })
}

export const getLoggedInUserMediaRefsFromBackEnd = async (bearerToken, sort = PV.queryParams.most_recent, page = 1) => {
  if (!bearerToken) return [[], 0]

  const filteredQuery: any = {}
  filteredQuery.sort = sort
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.mediaRefs}?${queryString}`, {
    method: 'get',
    headers: {
      Authorization: bearerToken
    }
  })
}

export const getLoggedInUserPlaylistsFromFrontEnd = async (page = 1) => {
  const filteredQuery: any = {}
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.playlists}?${queryString}`, {
    method: 'get',
    data: {
      page
    },
    withCredentials: true
  })
}

export const getLoggedInUserPlaylistsFromBackEnd = async (bearerToken, page = 1) => {
  if (!bearerToken) return [[], 0]

  const filteredQuery: any = {}
  filteredQuery.page = page
  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.playlists}?${queryString}`, {
    method: 'get',
    data: {
      page
    },
    headers: {
      Authorization: bearerToken
    }
  })
}

export const deleteLoggedInUser = async (id: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.user}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const updateLoggedInUser = async (data: any) => {
  return axios(`${API_BASE_URL}${PV.paths.api.user}`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const downloadLoggedInUserData = async (id: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.user}${PV.paths.api.download}`, {
    method: 'get',
    withCredentials: true
  })
}
