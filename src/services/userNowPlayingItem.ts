import axios from 'axios'
import { convertToNowPlayingItem, NowPlayingItem } from 'podverse-shared'
import { getNowPlayingItemFromStorage, setNowPlayingItemInStorage } from 'podverse-ui'
import config from '~/config'
import PV from '~/lib/constants'
const { API_BASE_URL } = config()

export const getNowPlayingItem = async (user) => 
  user && user.id
    ? getNowPlayingItemOnServer()
    : getNowPlayingItemFromStorage()

export const setNowPlayingItem = async (item: NowPlayingItem | null, playbackPosition: number, user: any) =>
  user && user.id
    ? setNowPlayingItemOnServer(item, playbackPosition)
    : setNowPlayingItemInStorage()

export const getNowPlayingItemOnServer = async () => {
  let item = null as any
  try {
    const response = await axios(`${API_BASE_URL}${PV.paths.api.user_now_playing_item}`, {
      method: 'get',
      withCredentials: true
    })

    const { episode, mediaRef, userPlaybackPosition } = response.data

    if (!episode && !mediaRef) {
      throw new Error('Response data missing both episode and mediaRef')
    }

    item = convertToNowPlayingItem(mediaRef || episode, {}, {}, userPlaybackPosition) || {}

  } catch (error) {
    console.log('Error in getNowPlayingItemOnServer: ', error)
    item = null
  }

  return item
}

export const setNowPlayingItemOnServer = async (item: NowPlayingItem | null, playbackPosition: number) => {
  if (!item || (!item.clipId && !item.episodeId)) {
    return
  }

  playbackPosition = (playbackPosition && Math.floor(playbackPosition)) || 0
  item.userPlaybackPosition = playbackPosition
  await setNowPlayingItemInStorage(item)

  const { clipId, episodeId } = item
  const data = {
    ...(clipId ? { clipId } : {}),
    ...(!clipId ? { episodeId } : {}),
    userPlaybackPosition: playbackPosition
  }

  return axios(`${API_BASE_URL}${PV.paths.api.user_now_playing_item}`, {
    method: 'patch',
    data,
    withCredentials: true
  })
}
