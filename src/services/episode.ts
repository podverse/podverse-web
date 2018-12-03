import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/utility'

export const getEpisodeById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/episode/${id}`);
}

export const getEpisodesByQuery = async (query: EpisodeQuery) => {
  const queryString = convertObjectToQueryString(query)
  return axios.get(`http://localhost:3000/api/v1/episode?${queryString}`)
}

type EpisodeQuery = {
  authors?: any[]
  category?: string
  categories?: any[]
  description?: string
  duration?: number
  episodeType?: string
  guid?: string
  id?: string
  imageUrl?: string
  isExplicit?: boolean
  isPublic?: boolean
  linkUrl?: string
  mediaUrl?: string
  mediaRefs?: any[]
  podcastId?: string
  pubDate?: string
  skip?: number
  sort?: string
  take?: number
  title?: string
}
