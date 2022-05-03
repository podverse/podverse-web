import { getAuthCredentialsHeaders } from '~/lib/utility/auth'
import { request } from './request'

export const sendPodpingLiveStatusUpdate = async (feedUrl: string) => {
  const response = await request({
    endpoint: '/podping/feed/live-update',
    method: 'post',
    body: {
      feedUrl
    },
    ...getAuthCredentialsHeaders()
  })

  return response && response.data
}
