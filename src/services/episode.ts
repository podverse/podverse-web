import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const getEpisodeById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/episode/${id}`)
}

export const getEpisodesByQuery = async (query) => {
  const filteredQuery: any = {}

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = 'top-past-week'
  }

  if (query.from === 'from-podcast') {
    filteredQuery.podcastId = query.podcastId
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = Array.isArray(query.podcastId) && query.podcastId.length > 0 ? query.podcastId : ['no-results']
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchAllFieldsText) {
    filteredQuery.searchAllFieldsText = query.searchAllFieldsText
  }

  if (query.includePodcast) {
    filteredQuery.includePodcast = query.includePodcast
  }

  const queryString = convertObjectToQueryString(filteredQuery)  
  return axios(`${API_BASE_URL}/episode?${queryString}`, {
    method: 'get'
  })
}
