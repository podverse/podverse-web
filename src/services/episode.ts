import axios from 'axios'
import PV from '~/lib/constants'
import { convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const getEpisodeById = async (id: string) => {
  return axios.get(`${API_BASE_URL}${PV.paths.episode}/${id}`)
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
    filteredQuery.sort = PV.query.top_past_week
  }

  if (query.from === PV.query.from_podcast) {
    filteredQuery.podcastId = query.podcastId
  } else if (query.from === PV.query.subscribed_only) {
    filteredQuery.podcastId = Array.isArray(query.podcastId) && query.podcastId.length > 0 ? query.podcastId : ['no-results']
  } else if (query.from === PV.query.from_category) {
    filteredQuery.categories = query.categories
    filteredQuery.includePodcast = true
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
  return axios(`${API_BASE_URL}${PV.paths.episode}?${queryString}`, {
    method: 'get'
  })
}
