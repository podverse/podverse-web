import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'
import { request } from '~/services'
import config from '~/config'
const { API_BASE_URL } = config()

export const getPodcastsByQuery = async (query) => {
  const filteredQuery: any = {}

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

  if (query.from === 'from-category') {
    filteredQuery.categories = query.categories
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = Array.isArray(query.subscribedPodcastIds) && query.subscribedPodcastIds.length > 0
      ? query.subscribedPodcastIds : ['no-results']
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchBy === 'podcast') {
    filteredQuery.searchTitle = query.searchText
  } else if (query.searchBy === 'host') {
    filteredQuery.searchAuthor = query.searchText
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}/podcast?${queryString}`, {
    method: 'get'
  })
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `/podcast/${id}`
  })
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`${API_BASE_URL}/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
