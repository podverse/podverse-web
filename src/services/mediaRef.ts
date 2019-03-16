import axios from 'axios'
import { sfwFilterMediaRef, sfwFilterMediaRefs } from '~/lib/profanityFilter'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const createMediaRef = async (data: any) => {
  return axios(`${API_BASE_URL}/mediaRef`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const deleteMediaRef = async (id: string) => {
  return axios(`${API_BASE_URL}/mediaRef/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const getMediaRefsByQuery = async (query, nsfwMode = 'on') => {
  let filteredQuery: any = {}

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = 'top-past-week'
  }

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.from === 'from-podcast') {
    filteredQuery.podcastId = query.podcastId
  } else if (query.from === 'from-episode') {
    filteredQuery.episodeId = query.episodeId
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = query.podcastId ? query.podcastId : ['no-results']
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchAllFieldsText) {
    filteredQuery.searchAllFieldsText = query.searchAllFieldsText
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}/mediaRef?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterMediaRefs(result.data) }
  })
}

export const getMediaRefById = async (id: string, nsfwMode = 'on') => {
  return axios.get(`${API_BASE_URL}/mediaRef/${id}`)
  .then(result => {
    return nsfwMode === 'on' ? { data: result.data } : { data: sfwFilterMediaRef(result.data) }
  })
}

export const updateMediaRef = async (data: any) => {
  return axios(`${API_BASE_URL}/mediaRef`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
