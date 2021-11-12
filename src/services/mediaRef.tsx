import { PV } from "~/resources"
import { request } from '~/services/request'

type MediaRefQueryParams = {
  categories?: string[]
  episodeId?: string | string[]
  includeEpisode?: boolean
  includePodcast?: boolean
  page?: number
  podcastId?: string | string[]
  searchAllFieldsText?: string
  sort?: string
}

export const getMediaRefsByQuery = async ({ categories, episodeId, includeEpisode,
  includePodcast, page, podcastId, searchAllFieldsText, sort }) => {
  const filteredQuery: MediaRefQueryParams = {
    ...(categories ? { categories } : {}),
    ...(episodeId ? { episodeId } : {}),
    ...(includeEpisode ? { includeEpisode } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastId ? { podcastId } : {}),
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
