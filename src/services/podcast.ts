import axios from 'axios'

export const getPodcastById = async (id: string) => {
  return axios.get(`http://localhost:3000/api/v1/podcast/${id}`);
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`http://localhost:3000/api/v1/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
