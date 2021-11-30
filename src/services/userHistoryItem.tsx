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
