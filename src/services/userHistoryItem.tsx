import OmniAural from 'omniaural'
import { NowPlayingItem } from 'podverse-shared'
import { unstable_batchedUpdates } from 'react-dom'
import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { PV } from '~/resources'
import { request } from './request'
import { setNowPlayingItemOnServer } from './userNowPlayingItem'

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
    ...getAuthCredentialsHeaders(bearerToken)
  })

  const { userHistoryItems = [], userHistoryItemsCount = 0 } = response.data
  return { userHistoryItems, userHistoryItemsCount }
}

export const removeHistoryItemsAllOnServer = async () => {
  await request({
    endpoint: '/user-history-item/remove-all',
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })

  return []
}

export const removeHistoryItemEpisodeOnServer = async (episodeId?: string, userHistoryItems?: NowPlayingItem[]) => {
  const newUserHistoryItems = userHistoryItems.filter(
    (userHistoryItem: NowPlayingItem) => userHistoryItem.episodeId != episodeId || userHistoryItem.clipId
  )

  await request({
    endpoint: `/user-history-item/episode/${episodeId}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })

  return newUserHistoryItems
}

export const removeHistoryItemMediaRefOnServer = async (mediaRefId?: string, userHistoryItems?: NowPlayingItem[]) => {
  const newUserHistoryItems = userHistoryItems.filter(
    (userHistoryItem: NowPlayingItem) => userHistoryItem.clipId != mediaRefId
  )
  await request({
    endpoint: `/user-history-item/mediaRef/${mediaRefId}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })

  return newUserHistoryItems
}

type AddUpdateParams = {
  nowPlayingItem: NowPlayingItem
  playbackPosition: number
  mediaFileDuration?: number | null
  forceUpdateOrderDate?: boolean
  skipSetNowPlaying?: boolean
  completed?: boolean
}

export const addOrUpdateHistoryItemOnServer = async ({
  nowPlayingItem,
  playbackPosition,
  mediaFileDuration,
  forceUpdateOrderDate,
  skipSetNowPlaying,
  completed
}: AddUpdateParams) => {
  if (!nowPlayingItem) return

  const userInfo = OmniAural.state.session.userInfo.value()
  if (!userInfo) return

  if (!skipSetNowPlaying) {
    await setNowPlayingItemOnServer(nowPlayingItem, playbackPosition)
  }

  playbackPosition = Math.floor(playbackPosition) || 0

  const { clipId, clipIsOfficialChapter, episodeId } = nowPlayingItem

  /* If duration is found in historyItemsIndex, pass that as a parameter. */
  const historyItemsIndex = OmniAural.state.historyItemsIndex.value()
  const historyItem = historyItemsIndex.episodes[episodeId]
  const duration = historyItem?.d
    ? historyItem.d
    : mediaFileDuration || mediaFileDuration === 0
    ? Math.floor(mediaFileDuration)
    : 0

  await request({
    endpoint: '/user-history-item',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body: {
      episodeId: clipId && !clipIsOfficialChapter ? null : episodeId,
      mediaRefId: clipId && !clipIsOfficialChapter ? clipId : null,
      forceUpdateOrderDate: forceUpdateOrderDate === false ? false : true,
      mediaFileDuration: duration,
      userPlaybackPosition: playbackPosition,
      ...(completed === true || completed === false ? { completed } : {})
    }
  })

  /* Always regenerate the historyItemsIndex and set on global state after addOrUpdate */
  const newHistoryItemsIndex = await getHistoryItemsIndexFromServer()
  unstable_batchedUpdates(() => {
    OmniAural.setHistoryItemsIndex(newHistoryItemsIndex)
  })
}

export const getServerSideHistoryItemsIndex = async (cookies: any) => {
  let historyItemsIndex = { episodes: {}, mediaRefs: {} } as any
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
      endpoint: '/user-history-item/metadata-mini',
      method: 'GET',
      ...getAuthCredentialsHeaders(bearerToken)
    })) as any
  } catch (error) {
    console.log('getHistoryItemsIndexFromServer error', error)
  }

  const { userHistoryItems } = response.data
  return generateHistoryItemsIndexDictionary(userHistoryItems)
}

type baseHistoryItem = {
  /** mediaFileDuration */
  d: number | null
  /** userPlaybackPosition */
  p: number
}
type MediaRefHistoryItem = baseHistoryItem & {
  /** mediaRefId */
  m: number
}

type EpisodeHistoryItem = baseHistoryItem & {
  /** episodeId */
  e: number
  /** complete */
  c: boolean
}

type HistoryItem = MediaRefHistoryItem | EpisodeHistoryItem

const isMediaRefHistoryItem = (item: HistoryItem): item is MediaRefHistoryItem => 'm' in item
const isEpisodeHistoryItem = (item: HistoryItem): item is EpisodeHistoryItem => 'e' in item

const generateHistoryItemsIndexDictionary = (historyItems: HistoryItem[]) => {
  const historyItemsIndex: {
    episodes: Record<number, Omit<EpisodeHistoryItem, 'e'>>
    mediaRefs: Record<number, Omit<MediaRefHistoryItem, 'm'>>
  } = {
    episodes: {},
    mediaRefs: {}
  }

  if (!historyItems) {
    historyItems = []
  }

  for (const historyItem of historyItems) {
    if (isMediaRefHistoryItem(historyItem)) {
      historyItemsIndex.mediaRefs[historyItem.m] = {
        d: historyItem.d || null,
        p: historyItem.p
      }
    } else if (isEpisodeHistoryItem(historyItem)) {
      historyItemsIndex.episodes[historyItem.e] = {
        d: historyItem.d || null,
        p: historyItem.p,
        ...(historyItem.c ? { c: historyItem.c } : { c: false })
      }
    }
  }

  return historyItemsIndex
}
