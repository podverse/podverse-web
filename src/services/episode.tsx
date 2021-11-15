import { PV } from "~/resources"
import { request } from '~/services/request'

export const getEpisodeById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.episode}/${id}`,
    method: 'get'
  })
}

type EpisodeQueryParams = {
  categories?: string[]
  includePodcast?: boolean
  page?: number
  podcastId?: string | string[]
  searchAllFieldsText?: string
  sort?: string
}

export const getEpisodesByQuery = async ({ categories, includePodcast, page,
  podcastId, searchAllFieldsText, sort }: EpisodeQueryParams) => {
  const filteredQuery: EpisodeQueryParams = {
    ...(categories ? { categories } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastId ? { podcastId } : {}),
    ...(searchAllFieldsText ? {
      searchAllFieldsText: encodeURIComponent(searchAllFieldsText)
    } : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._mostRecent })
  }

  return request({
    endpoint: PV.RoutePaths.api.episode,
    method: 'get',
    query: filteredQuery
  })
}
