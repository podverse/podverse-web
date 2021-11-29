import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from '~/services/request'

export const getMediaRefById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.mediaRef}/${id}`,
    method: 'get'
  })
}

type MediaRefQueryParams = {
  categories?: string[]
  episodeId?: string | string[]
  includeEpisode?: boolean
  includePodcast?: boolean
  page?: number
  podcastIds?: string | string[]
  searchAllFieldsText?: string
  sort?: string
}

export const getMediaRefsByQuery = async ({ categories, episodeId, includeEpisode,
  includePodcast, page, podcastIds, searchAllFieldsText, sort }: MediaRefQueryParams) => {
  const filteredQuery: MediaRefQueryParams = {
    ...(categories ? { categories } : {}),
    ...(episodeId ? { episodeId } : {}),
    ...(includeEpisode ? { includeEpisode } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    ...(searchAllFieldsText ? {
      searchAllFieldsText: encodeURIComponent(searchAllFieldsText)
    } : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._mostRecent })
  }

  if (podcastIds?.length === 0) {
    return { data: [[], 0] }
  } else {
    return request({
      endpoint: PV.RoutePaths.api.mediaRef,
      method: 'get',
      query: filteredQuery
    })
  }
}

export const getUserMediaRefs = async (userId: string, query: any = {}) => {
  const response = await request({
    endpoint: `/user/${userId}/mediaRefs`,
    query
  })

  return response && response.data
}

export const retrieveLatestChaptersForEpisodeId = async (id: string) => {
  const response = await request({
    endpoint: `/episode/${id}/retrieve-latest-chapters`
  })

  return response && response.data
}

type MediaRefCreateBody = {
  endTime?: number
  episodeId: string
  isPublic: boolean
  startTime: number
  title?: string
}

export const createMediaRef = async (body: MediaRefCreateBody) => {
  const response = await request({
    endpoint: '/mediaRef',
    method: 'POST',
    ...(getAuthCredentialsHeaders()),
    body
  })

  return response && response.data
}
