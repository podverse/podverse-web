import axios from 'axios'
import { NowPlayingItem } from 'podverse-shared'
import { setNowPlayingItem } from './userNowPlayingItem'
import config from '~/config'
import PV from '~/lib/constants'
const { API_BASE_URL } = config()

export const addOrUpdateHistoryItem = async (
  item: NowPlayingItem,
  playbackPosition: number,
  user?: any
) => {
  await setNowPlayingItem(item, playbackPosition, user)

  playbackPosition = Math.floor(playbackPosition) || 0

  const { clipId, episodeId } = item
  const data = {
    episodeId: clipId ? null : episodeId,
    mediaRefId: clipId,
    userPlaybackPosition: playbackPosition,
    forceUpdateOrderDate: true
  }

  return axios(`${API_BASE_URL}${PV.paths.api.user_history_item}`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}

export const getHistoryItemsFromServerWithBearerToken = async (bearerToken: string, page: number) => {
  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_history_item}`, {
    method: 'get',
    params: {
      page
    },
    headers: {
      Authorization: bearerToken
    }
  })

  const { userHistoryItems, userHistoryItemsCount } = response.data
  return { userHistoryItems, userHistoryItemsCount }
}

const generateHistoryItemsIndex = (historyItems: any[]) => {
  const historyItemsIndex = {
    episodes: {},
    mediaRefs: {}
  }

  for (const historyItem of historyItems) {
    if (historyItem.mediaRefId) {
      historyItemsIndex.mediaRefs[historyItem.mediaRefId] = historyItem.userPlaybackPosition
    } else if (historyItem.episodeId) {
      historyItemsIndex.episodes[historyItem.episodeId] = historyItem.userPlaybackPosition
    }
  }

  return historyItemsIndex
}

export const getHistoryItemsIndex = async () => {
  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_history_item}/metadata`, {
    method: 'get',
    withCredentials: true
  })

  const { userHistoryItems } = response.data
  return generateHistoryItemsIndex(userHistoryItems)
}
