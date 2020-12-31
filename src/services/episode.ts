import axios from 'axios'
import { convertToNowPlayingItem } from 'podverse-shared'
import config from '~/config'
import PV from '~/lib/constants'
import { clone, convertObjectToQueryString } from '~/lib/utility'
const { API_BASE_URL } = config()

export const getEpisodeById = async (id: string) => {
  return axios.get(`${API_BASE_URL}${PV.paths.api.episode}/${id}`)
}

export const getEpisodesByQuery = async (query) => {
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
  } else if (query.from === PV.queryParams.subscribed_only) {
    filteredQuery.podcastId = Array.isArray(query.podcastId) && query.podcastId.length > 0 ? query.podcastId : ['no-results']
  } else if (query.from === PV.queryParams.from_category) {
    filteredQuery.categories = query.categories
    filteredQuery.includePodcast = true
  } else {
    // from = all-podcasts
    // add nothing
  }

  if (query.searchAllFieldsText) {
    filteredQuery.searchAllFieldsText = query.searchAllFieldsText ? encodeURIComponent(query.searchAllFieldsText) : ''
  }

  if (query.includePodcast) {
    filteredQuery.includePodcast = query.includePodcast
  }

  const queryString = convertObjectToQueryString(filteredQuery)  
  return axios(`${API_BASE_URL}${PV.paths.api.episode}?${queryString}`, {
    method: 'get'
  })
}

export const handlePageEpisodesQuery = async (obj) => {
  const { categoryId, currentPage, nowPlayingItem, pageIsLoading, pagesSetQueryState,
    podcastId, queryFrom, queryPage, queryRefresh, querySort,
    queryType, store } = obj

  if (Object.keys(currentPage).length === 0 || queryRefresh) {
    const results = await getEpisodesByQuery({
      from: queryFrom,
      page: queryPage,
      ...(podcastId ? { podcastId } : {}),
      sort: querySort,
      type: queryType,
      ...(categoryId ? { categories: categoryId } : {}),
      includePodcast: true
    })

    const listItems = results.data[0].map(x => convertToNowPlayingItem(x, null, null)) || []
    const nowPlayingItemIndex = listItems.map((x) => x.episodeId).indexOf(nowPlayingItem && nowPlayingItem.episodeId)
    const queuedListItems = clone(listItems)
    if (nowPlayingItemIndex > -1) {
      queuedListItems.splice(0, nowPlayingItemIndex + 1)
    }

    store.dispatch(pagesSetQueryState({
      pageKey: PV.pageKeys.episodes,
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