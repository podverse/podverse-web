import axios from 'axios'

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`http://localhost:3000/api/v1/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
