import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from './request'

export const parseFeedByPodcastId = async (podcastId: string) => {
  const response = await request({
    endpoint: `/dev-admin/parse-feed-by-podcast-id/${podcastId}`,
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}

export const addOrUpdateFeedFromPodcastIndex = async (podcastIndexId: string) => {
  const response = await request({
    endpoint: `/dev-admin/add-or-update-feed-from-podcast-index/${podcastIndexId}`,
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}
