import { LiveItemStatus } from 'podverse-shared'
import { PV } from '~/resources'
import { request } from './request'

export const getPublicLiveItemsByPodcastId = async (podcastId: string) => {
  if (!podcastId) {
    return []
  } else {
    const liveItems = await request({
      endpoint: `${PV.RoutePaths.api.live_item}/podcast/${podcastId}`,
      method: 'get'
    })

    const { data } = liveItems
    const episodes = []

    for (const liveItem of data) {
      const episode = liveItem.episode
      delete liveItem.episode
      episode.liveItem = liveItem
      episodes.push(episode)
    }

    return episodes
  }
}

export const ariaLiveItemStatusLabel = (liveItemStatus: LiveItemStatus, t: any) => {
  let ariaLiveItemStatus = ''
  if (liveItemStatus === 'live') {
    ariaLiveItemStatus = t('Live Now')
  } else if (liveItemStatus === 'pending') {
    ariaLiveItemStatus = t('Live Time')
  } else if (liveItemStatus === 'ended') {
    ariaLiveItemStatus = t('Live Ended')
  }
  return ariaLiveItemStatus
}
