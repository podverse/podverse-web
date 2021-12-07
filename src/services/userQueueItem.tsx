import OmniAural from 'omniaural'
import { NowPlayingItem } from 'podverse-shared'
import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { PV } from '~/resources'
import { request } from './request'

export const getServerSideUserQueueItems = async (cookies: any) => {
  let userQueueItems = []
  if (cookies.Authorization) {
    userQueueItems = await getQueueItemsFromServer(cookies.Authorization)
  }
  return userQueueItems
}

export const getQueueItemsFromServer = async (bearerToken?: string) => {
  let response = {
    data: {
      userQueueItems: []
    }
  }

  try {
    response = await request({
      endpoint: PV.RoutePaths.api.user_queue_item,
      method: 'get',
      ...getAuthCredentialsHeaders(bearerToken)
    })
  } catch (error) {
    // console.log('getQueueItemsFromServer', error)
  }

  return response?.data?.userQueueItems || []
}

export const removeQueueItemEpisodeFromServer = async (episodeId: string) => {
  const response = await request({
    endpoint: `/user-queue-item/episode/${episodeId}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })
  return response?.data?.userQueueItems || []
}

export const removeQueueItemMediaRefFromServer = async (mediaRefId: string) => {
  const response = await request({
    endpoint: `/user-queue-item/mediaRef/${mediaRefId}`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })
  return response?.data?.userQueueItems || []
}

export const removeQueueItemsAllFromServer = async () => {
  await request({
    endpoint: `/user-queue-item/remove-all`,
    method: 'DELETE',
    ...getAuthCredentialsHeaders()
  })
  return []
}

export const addQueueItemLastOnServer = async (item: NowPlayingItem) => {
  const maxQueuePosition = 100000
  return addQueueItemToServer(item, maxQueuePosition)
}
export const addQueueItemNextOnServer = async (item: NowPlayingItem) => {
  return addQueueItemToServer(item, 0)
}

export const addQueueItemToServer = async (item: NowPlayingItem, newPosition: number) => {
  const { clipId, episodeId } = item

  if (!clipId && !episodeId) {
    throw new Error('A clipId or episodeId must be provided.')
  }

  const body = {
    episodeId: (!clipId && episodeId) || null,
    mediaRefId: clipId || null,
    queuePosition: newPosition
  }

  const response = await request({
    endpoint: '/user-queue-item',
    method: 'PATCH',
    ...getAuthCredentialsHeaders(),
    body
  })

  const { userQueueItems } = response.data

  return userQueueItems
}

export const getNextFromQueue = async () => {
  const userInfo = OmniAural.state.session.userInfo.value()
  let item = null

  if (userInfo) {
    const data = await getNextFromQueueFromServer()
    if (data) {
      const { nextItem } = data
      item = nextItem
    }
  }

  return item
}

const getNextFromQueueFromServer = async () => {
  const response = await request({
    endpoint: '/user-queue-item/pop-next',
    method: 'GET',
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}
