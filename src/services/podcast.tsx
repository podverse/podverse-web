import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'
import { PV } from '~/resources'
import { request } from '~/services/request'

export const getPodcastsByQuery = async (query) => {
  const filteredQuery: any = {
    ...(query.maxResults ? { maxResults: true } : {})
  }

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = PV.Filters.sort._topPastWeek
  }

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.from === PV.Filters.type._categoryKey) {
    filteredQuery.categories = query.categories
  } else if (query.from === PV.Filters.type._subscribedKey) {
    filteredQuery.podcastId = Array.isArray(query.subscribedPodcastIds) && query.subscribedPodcastIds.length > 0
      ? query.subscribedPodcastIds : []
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchBy === PV.Filters.search.queryParams.podcast) {
    filteredQuery.searchTitle = query.searchText ? encodeURIComponent(query.searchText) : ''
  } else if (query.searchBy === PV.Filters.search.queryParams.host) {
    filteredQuery.searchAuthor = query.searchText ? encodeURIComponent(query.searchText) : ''
  }

  const queryString = convertObjectToQueryString(filteredQuery)

  return axios(`${PV.Config.API_BASE_URL}${PV.RoutePaths.api.podcast}?${queryString}`, {
    method: 'get'
  })
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.podcast}/${id}`
  })
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`${PV.Config.API_BASE_URL}${PV.RoutePaths.api.podcast}${PV.RoutePaths.api.toggle_subscribe}/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
