import { PV } from '~/resources'
import { request } from '~/services/request'

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.podcast}${PV.RoutePaths.api.toggle_subscribe}/${podcastId}`,
    method: 'get',
    withCredentials: true
  })
}
