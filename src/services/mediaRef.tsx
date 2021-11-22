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

  return request({
    endpoint: PV.RoutePaths.api.mediaRef,
    method: 'get',
    query: filteredQuery
  })
}

export const getUserMediaRefs = async (userId: string, query: any = {}) => {
  const response = await request({
    endpoint: `/user/${userId}/mediaRefs`,
    query
  })

  return response && response.data
}
