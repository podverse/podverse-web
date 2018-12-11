import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'

export const createMediaRef = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/mediaRef`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const deleteMediaRef = async (id: string) => {
  return axios(`http://localhost:3000/api/v1/mediaRef/${id}`, {
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
    filteredQuery.podcastId = query.subscribedPodcastIds
  } else { // from = all-podcasts
    // add nothing
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`http://localhost:3000/api/v1/mediaRef?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
}

export const getMediaRefById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/mediaRef/${id}`)
}

export const updateMediaRef = async (data: any) => {
  return axios(`http://localhost:3000/api/v1/mediaRef`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
