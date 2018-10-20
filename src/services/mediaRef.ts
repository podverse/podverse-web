import axios from 'axios'
import { convertObjectToQueryString } from '~/lib/util'

export const getMediaRefById = (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/mediaRef/${id}`);
}

export const getMediaRefsByQuery = (query: MediaRefQuery) => {
  const queryString = convertObjectToQueryString(query)
  return axios.get(`http://localhost:3000/api/v1/mediaRef?${queryString}`)
}

type MediaRefQuery = {
  _episodeId?: string
  _podcastId?: string
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
