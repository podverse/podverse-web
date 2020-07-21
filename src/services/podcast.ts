import axios from 'axios'
import PV from '~/lib/constants'
import { convertObjectToQueryString } from '~/lib/utility'
import { request } from '~/services'
import config from '~/config'
const { API_BASE_URL } = config()

export const getPodcastsByQuery = async (query) => {
  const filteredQuery: any = {}

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = PV.query.top_past_week
  }

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.from === PV.query.from_category) {
    filteredQuery.categories = query.categories
  } else if (query.from === PV.query.subscribed_only) {
    filteredQuery.podcastId = Array.isArray(query.subscribedPodcastIds) && query.subscribedPodcastIds.length > 0
      ? query.subscribedPodcastIds : [PV.query.no_results]
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchBy === PV.query.podcast) {
    filteredQuery.searchTitle = query.searchText
  } else if (query.searchBy === PV.query.host) {
    filteredQuery.searchAuthor = query.searchText
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}${PV.paths.podcast}?${queryString}`, {
    method: 'get'
  })
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `${PV.paths.podcast}/${id}`
  })
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`${API_BASE_URL}${PV.paths.podcast}${PV.paths.toggle_subscribe}/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
