import { PV } from '~/resources'
import { request } from '~/services/request'

type PodcastQueryParams = {
  categories?: string[]
  hasVideo?: boolean
  maxResults?: boolean
  page?: number
  podcastIds?: string[]
  searchBy?: string
  searchText?: string
  sort?: string
  subscribed?: boolean
}

export const getPodcastsByQuery = async ({
  categories,
  hasVideo,
  maxResults,
  page,
  podcastIds,
  searchBy,
  searchText,
  sort,
  subscribed
}: PodcastQueryParams) => {
  const filteredQuery: PodcastQueryParams = {
    ...(categories ? { categories } : {}),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    // If no "from", then from defaults to _allKey
    ...(hasVideo ? { hasVideo } : {}),
    ...(maxResults ? { maxResults: true } : {}),
    ...(page ? { page } : { page: 1 }),
    ...(searchBy === PV.Filters.search.queryParams.podcast ? { searchTitle: encodeURIComponent(searchText) } : {}),
    ...(searchBy === PV.Filters.search.queryParams.host ? { searchAuthor: encodeURIComponent(searchText) } : {}),
    ...(sort ? { sort } : {})
  }

  const endpoint = subscribed ? `${PV.RoutePaths.api.podcast}/subscribed` : PV.RoutePaths.api.podcast

  if (podcastIds?.length === 0 || categories?.length === 0) {
    return { data: [[], 0] }
  } else {
    const response = await request({
      endpoint,
      method: 'get',
      query: filteredQuery
    })

    return response
  }
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.podcast}/${id}`
  })
}
