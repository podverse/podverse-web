import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'

export const getPodcastById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/podcast/${id}`);
}

export const getPodcastsByQuery = async (query: PodcastQuery) => {
  const queryString = convertObjectToQueryString(query)
  return axios.get(`http://localhost:3000/api/v1/podcast?${queryString}`)
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`http://localhost:3000/api/v1/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}

type PodcastQuery = {
  authors?: any[]
  categories?: any[]
  guid?: string
  id?: string
  isExplicit?: boolean
  language?: string
  title?: string
}
