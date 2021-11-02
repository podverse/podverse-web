import axios from 'axios'
import { convertToNowPlayingItem, NowPlayingItem } from 'podverse-shared'
import { addItemToPriorityQueueStorage, getPriorityQueueItemsStorage,
  removeItemFromPriorityQueueStorage, updatePriorityQueueStorage } from 'podverse-ui'
import PV from '~/lib/constants'
import config from '~/config'
const { API_BASE_URL } = config()

export const addQueueItemLastToServer = async (item: NowPlayingItem) => {
  return addQueueItemToServer(item, 100000000)
}

export const addQueueItemNextToServer = async (item: NowPlayingItem) => {
  return addQueueItemToServer(item, 0)
}

export const getQueueItems = async (user) =>
  user && user.id
    ? getQueueItemsFromServer()
    : getPriorityQueueItemsStorage()

export const getQueueItemsFromServerWithBearerToken = async (bearerToken) => {
  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}`, {
    method: 'get',
    headers: {
      Authorization: bearerToken
    }
  })

  const userQueueItems = response && response.data && response.data.userQueueItems
  return userQueueItems
}

export const getQueueItemsFromServer = async () => {
  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}`, {
    method: 'get',
    withCredentials: true
  })

  const userQueueItems = response && response.data && response.data.userQueueItems
  setAllQueueItemsLocally(userQueueItems)

  return userQueueItems
}

export const popNextFromQueueFromServer = async () => {
  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}/pop-next`, {
    method: 'get',
    withCredentials: true
  })

  const { nextItem, userQueueItems } = response.data
  await setAllQueueItemsLocally(userQueueItems)
  return { nextItem, userQueueItems }
}

export const addQueueItemLocally = async (
  nowPlayingItem: NowPlayingItem, episode: any, mediaRef: any, isLast: boolean) => {
  if (nowPlayingItem && nowPlayingItem.episodeMediaUrl) {
    addItemToPriorityQueueStorage(nowPlayingItem, isLast)
  } else if (mediaRef) {
    addItemToPriorityQueueStorage(convertToNowPlayingItem(mediaRef))
  } else if (episode) {
    addItemToPriorityQueueStorage(convertToNowPlayingItem(episode))
  }

  return getPriorityQueueItemsStorage()
}

export const addQueueItemToServer = async (item: NowPlayingItem, newPosition: number) => {
  const { clipId, episodeId } = item

  if (!clipId && !episodeId) {
    throw new Error('A clipId or episodeId must be provided.')
  }

  const data = {
    episodeId: (!clipId && episodeId) || null,
    mediaRefId: clipId || null,
    queuePosition: newPosition
  }

  const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}`, {
    method: 'patch',
    data,
    withCredentials: true
  })

  const { userQueueItems } = response.data
  if (userQueueItems) {
    await updatePriorityQueueStorage(userQueueItems)
  }

  return userQueueItems
}

export const removeQueueItemOnServer = async (clipId?: string, episodeId?: string) => {
  removeItemFromPriorityQueueStorage(clipId, episodeId)
  if (clipId) {
    const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}/mediaRef/${clipId}`, {
      method: 'delete',
      withCredentials: true
    })
    return response && response.data && response.data.userQueueItems
  } else if (episodeId) {
    const response = await axios(`${API_BASE_URL}${PV.paths.api.user_queue_item}/episode/${episodeId}`, {
      method: 'delete',
      withCredentials: true
    })
    return response && response.data && response.data.userQueueItems
  } else {
    throw new Error('Must provide a clipId or episodeId.')
  }  
}

export const setAllQueueItemsLocally = (items: NowPlayingItem[]) => {
  updatePriorityQueueStorage(items)
}
