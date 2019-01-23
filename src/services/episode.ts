import axios from 'axios'
import { API_BASE_URL } from '~/config'
import { convertObjectToQueryString } from '~/lib/utility'

export const getEpisodeById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/episode/${id}`);
}

export const getEpisodesByQuery = async (query, nsfwMode = 'on') => {
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
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = query.subscribedPodcastIds
  } else { // from = all-podcasts
    // add nothing
  }

  const queryString = convertObjectToQueryString(filteredQuery)  
  return axios(`${API_BASE_URL}/episode?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
}
