import { NowPlayingItem } from "podverse-shared"
import { getAuthCredentialsHeaders } from "~/lib/utility/auth"
import { PV } from "~/resources"
import { request } from './request'

export const getServerSideHistoryItems = async (page: number, cookies: any) => {
  let data = {} as any
  if (cookies.Authorization) {
    data = await getHistoryItemsFromServer(page, cookies.Authorization)
  }
  const { userHistoryItems = [], userHistoryItemsCount = 0 } = data
  return { userHistoryItems, userHistoryItemsCount }
}

export const getHistoryItemsFromServer = async (page: number, bearerToken?: string) => {
  const response = await request({
    endpoint: PV.RoutePaths.api.user_history_item,
    method: 'get',
    query: {
      page
    },
    ...(getAuthCredentialsHeaders(bearerToken))
  })

  const { userHistoryItems = [], userHistoryItemsCount = 0 } = response.data
  return { userHistoryItems, userHistoryItemsCount }
}

export const removeHistoryItemsAllOnServer = async () => {
  await request({
    endpoint: '/user-history-item/remove-all',
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })

  return []
}

export const removeHistoryItemEpisodeOnServer = async (
  episodeId?: string,
  userHistoryItems?: NowPlayingItem[]
) => {
  const newUserHistoryItems = userHistoryItems.filter((userHistoryItem: NowPlayingItem) =>
    userHistoryItem.episodeId != episodeId || userHistoryItem.clipId
  )

  await request({
    endpoint: `/user-history-item/episode/${episodeId}`,
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })

  return newUserHistoryItems
}

export const removeHistoryItemMediaRefOnServer = async (
  mediaRefId?: string,
  userHistoryItems?: NowPlayingItem[]
) => {
  const newUserHistoryItems = userHistoryItems.filter((userHistoryItem: NowPlayingItem) =>
    userHistoryItem.clipId != mediaRefId
  )
  await request({
    endpoint: `/user-history-item/mediaRef/${mediaRefId}`,
    method: 'DELETE',
    ...(getAuthCredentialsHeaders())
  })

  return newUserHistoryItems
}

export const addOrUpdateHistoryItemOnServer = async (
  nowPlayingItem: NowPlayingItem,
  playbackPosition: number,
  mediaFileDuration?: number | null,
  forceUpdateOrderDate?: boolean,
  completed?: boolean
) => {
  playbackPosition = Math.floor(playbackPosition) || 0

  const { clipId, episodeId } = nowPlayingItem

  await request({
    endpoint: '/user-history-item',
    method: 'PATCH',
    ...(getAuthCredentialsHeaders()),
    body: {
      episodeId: clipId ? null : episodeId,
      mediaRefId: clipId,
      forceUpdateOrderDate: forceUpdateOrderDate === false ? false : true,
      ...(mediaFileDuration || mediaFileDuration === 0 ? { mediaFileDuration: Math.floor(mediaFileDuration) } : {}),
      userPlaybackPosition: playbackPosition,
      ...(completed ? { completed } : {})
    }
  })
}

export const getServerSideHistoryItemsIndex = async (cookies: any) => {
  let historyItemsIndex = { episodes: [], mediaRefs: [] } as any
  if (cookies.Authorization) {
    historyItemsIndex = await getHistoryItemsIndexFromServer(cookies.Authorization)
  }
  return historyItemsIndex
}

export const getHistoryItemsIndexFromServer = async (bearerToken?: string) => {
  /* If user membership is expired, we don't want the 401 error to crash the app,
     so return an empty response body instead. */
  let response = {
    data: {
      userHistoryItems: []
    }
  }

  try {
    response = (await request({
      endpoint: '/user-history-item/metadata',
      method: 'GET',
      ...(getAuthCredentialsHeaders(bearerToken))
    })) as any
  } catch (error) {
    console.log('getHistoryItemsIndexFromServer error', error)
  }

  const { userHistoryItems } = response.data
  return generateHistoryItemsIndexDictionary(userHistoryItems)
}

const generateHistoryItemsIndexDictionary = (historyItems: any[]) => {
  const historyItemsIndex = {
    episodes: {},
    mediaRefs: {}
  }

  if (!historyItems) {
    historyItems = []
  }
  for (const historyItem of historyItems) {

    if (historyItem.mediaRefId) {
      historyItemsIndex.mediaRefs[historyItem.mediaRefId] = {
        mediaFileDuration: historyItem.mediaFileDuration || historyItem.episodeDuration,
        userPlaybackPosition: historyItem.userPlaybackPosition
      }
    } else if (historyItem.episodeId) {
      historyItemsIndex.episodes[historyItem.episodeId] = {
        mediaFileDuration: historyItem.mediaFileDuration || historyItem.episodeDuration,
        userPlaybackPosition: historyItem.userPlaybackPosition,
        ...(historyItem.completed ? { completed: historyItem.completed } : {})
      }
    }
  }

  return historyItemsIndex
}
