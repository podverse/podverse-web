import axios from 'axios'
import { PV } from '~/resources'
import { request } from '~/services/request'

type PodcastQueryParams = {
  categories?: string[]
  maxResults?: boolean
  page?: number
  podcastIds?: string[]
  searchBy?: string
  searchText?: string
  sort?: string
}

export const getPodcastsByQuery = async ({ categories, maxResults,
  page, podcastIds, searchBy, searchText, sort }: PodcastQueryParams) => {

  const filteredQuery: PodcastQueryParams = {
    ...(categories ? { categories } : {}),
    ...(podcastIds ? { podcastId: podcastIds } : {}),
    // If no "from", then from defaults to _allKey
    ...(maxResults ? { maxResults: true } : {}),
    ...(page ? { page } : { page: 1}),
    ...(searchBy === PV.Filters.search.queryParams.podcast ? { searchTitle: encodeURIComponent(searchText) } : {}),
    ...(searchBy === PV.Filters.search.queryParams.host ? { searchAuthor: encodeURIComponent(searchText) } : {}),
    ...(sort ? { sort } : {})
  }

  const response = await request({
    endpoint: PV.RoutePaths.api.podcast,
    method: 'get',
    query: filteredQuery
  })

  return response
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.podcast}/${id}`
  })
}
