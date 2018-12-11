import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'

export const getPodcastsByQuery = async (query, nsfwMode = 'on') => {
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

  if (query.from === 'from-category') {
    filteredQuery.categories = query.categories
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = query.subscribedPodcastIds
  } else { // from = all-podcasts
    // add nothing
  }

  if (query.searchBy === 'podcast') {
    filteredQuery.searchTitle = query.searchText
  } else if (query.searchBy === 'host') {
    filteredQuery.searchAuthor = query.searchText
  }
console.log(nsfwMode, 'asdf')
  const queryString = convertObjectToQueryString(query)
  return axios(`http://localhost:3000/api/v1/podcast?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
}

export const getPodcastById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/podcast/${id}`);
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`http://localhost:3000/api/v1/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
