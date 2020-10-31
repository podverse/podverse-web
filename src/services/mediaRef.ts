import axios from 'axios'
import { convertToNowPlayingItem } from 'podverse-shared'
import config from '~/config'
import PV from '~/lib/constants'
import { clone, convertObjectToQueryString } from '~/lib/utility'
import { playerQueueLoadSecondaryItems } from '~/redux/actions'
const { API_BASE_URL } = config()

export const createMediaRef = async (data: any) => {
  return axios(`${API_BASE_URL}${PV.paths.api.mediaRef}`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const deleteMediaRef = async (id: string) => {
  return axios(`${API_BASE_URL}${PV.paths.api.mediaRef}/${id}`, {
    method: 'delete',
    withCredentials: true
  })
}

export const getMediaRefsByQuery = async (query) => {
  const filteredQuery: any = {}

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = PV.queryParams.top_past_week
  }

  if (query.from === PV.queryParams.from_podcast) {
    filteredQuery.podcastId = query.podcastId
  } else if (query.from === PV.queryParams.from_episode) {
    filteredQuery.episodeId = query.episodeId
  } else if (query.from === PV.queryParams.subscribed_only) {
    filteredQuery.podcastId = Array.isArray(query.podcastId) && query.podcastId.length > 0 ? query.podcastId : ['no-results']
  } else if (query.from === PV.queryParams.from_category) {
    filteredQuery.categories = query.categories
    filteredQuery.includePodcast = true
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.includePodcast) {
    filteredQuery.includePodcast = true
  } else if (query.includeEpisode) {
    filteredQuery.includeEpisode = true
  }

  if (query.searchAllFieldsText) {
    filteredQuery.searchAllFieldsText = query.searchAllFieldsText ? encodeURIComponent(query.searchAllFieldsText) : ''
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}${PV.paths.api.mediaRef}?${queryString}`, {
    method: 'get'
  })
}

export const getMediaRefById = async (id: string) => {
  return axios.get(`${API_BASE_URL}${PV.paths.api.mediaRef}/${id}`)
}

export const updateMediaRef = async (data: any) => {
  return axios(`${API_BASE_URL}${PV.paths.api.mediaRef}`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const handlePageMediaRefsQuery = async (obj) => {
  const { categoryId, currentPage, nowPlayingItem, pageIsLoading, pagesSetQueryState, podcastId, queryFrom, queryPage,
    queryRefresh, querySort, queryType, store } = obj

  if (Object.keys(currentPage).length === 0 || queryRefresh) {
    const results = await getMediaRefsByQuery({
      from: queryFrom,
      includePodcast: true,
      page: queryPage,
      ...(podcastId ? { podcastId } : {}),
      sort: querySort,
      type: queryType,
      ...(categoryId ? { categories: categoryId } : {}),
    })

    const listItems = results.data[0].map(x => convertToNowPlayingItem(x, null, null)) || []
    const nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
    const queuedListItems = clone(listItems)
    if (nowPlayingItemIndex > -1) {
      queuedListItems.splice(0, nowPlayingItemIndex + 1)
    }

    store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

    store.dispatch(pagesSetQueryState({
      pageKey: PV.pageKeys.clips,
      categoryId,
      listItems,
      listItemsTotal: results.data[1],
      queryFrom,
      queryPage,
      querySort,
      queryType,
    }))
  }

  store.dispatch(pageIsLoading(false))
}