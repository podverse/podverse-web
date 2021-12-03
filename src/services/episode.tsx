import { PV } from '~/resources'
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
  podcastIds?: string | string[]
  searchAllFieldsText?: string
  sort?: string
}

export const getEpisodesByQuery = async ({
  categories,
  includePodcast,
  page,
  podcastIds,
  searchAllFieldsText,
  sort
}: EpisodeQueryParams) => {
  const filteredQuery: EpisodeQueryParams = {
    ...(categories ? { categories } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    ...(searchAllFieldsText
      ? {
          searchAllFieldsText: encodeURIComponent(searchAllFieldsText)
        }
      : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._mostRecent })
  }

  if (podcastIds?.length === 0) {
    return { data: [[], 0] }
  } else {
    return request({
      endpoint: PV.RoutePaths.api.episode,
      method: 'get',
      query: filteredQuery
    })
  }
}
