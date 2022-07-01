import { PV } from '~/resources'
import { request } from '~/services/request'

export const getEpisodeById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.episode}/${id}`,
    method: 'get'
  })
}

export type EpisodeQueryParams = {
  categories?: string[]
  hasVideo?: boolean
  maxResults?: boolean
  includePodcast?: boolean
  page?: number
  podcastIds?: string | string[]
  searchTitle?: string
  sort?: string
}

export const getEpisodesByQuery = async ({
  categories,
  hasVideo,
  includePodcast,
  maxResults,
  page,
  podcastIds,
  searchTitle,
  sort
}: EpisodeQueryParams) => {
  const filteredQuery: EpisodeQueryParams = {
    ...(categories ? { categories } : {}),
    ...(hasVideo ? { hasVideo } : {}),
    ...(includePodcast ? { includePodcast } : {}),
    ...(maxResults ? { maxResults } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    ...(searchTitle
      ? {
          searchTitle: encodeURIComponent(searchTitle)
        }
      : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._mostRecent })
  }

  if (podcastIds?.length === 0 || categories?.length === 0) {
    return { data: [[], 0] }
  } else {
    const episodeResponse = await request({
      endpoint: PV.RoutePaths.api.episode,
      method: 'get',
      query: filteredQuery
    })
    const [episodesData, episodesDataCount] = episodeResponse.data
    return { data: [episodesData, episodesDataCount] }
  }
}
