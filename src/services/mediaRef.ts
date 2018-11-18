import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/util'

export const createMediaRef = async (data: any) => {
  return axios.post(`http://localhost:3000/api/v1/mediaRef`, { ...data })
}

export const getMediaRefById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/mediaRef/${id}`)
}

export const getMediaRefsByQuery = async (query: MediaRefQuery) => {
  const queryString = convertObjectToQueryString(query)
  return axios.get(`http://localhost:3000/api/v1/mediaRef?${queryString}`)
}

type MediaRefQuery = {
  authors?: any[]
  categories?: any[]
  description?: string
  endTime?: number
  episodeDuration?: number
  episodeId?: string
  episodeImageUrl?: string
  episodeMediaUrl?: string
  episodePubDate?: string
  episodeSummary?: string
  episodeTitle?: string
  id?: string
  podcastFeedUrl?: string
  podcastGuid?: string
  podcastImageUrl?: string
  podcastIsExplicit?: boolean
  podcastTitle?: string
  startTime?: number
  title?: string
}
