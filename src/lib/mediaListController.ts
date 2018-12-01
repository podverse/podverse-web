import { getEpisodesByQuery, getMediaRefsByQuery } from '~/services/'

export const getQueryDataForClipPage = async (query, mediaRef, subscribedPodcastIds) => {
  let mediaListQuery: any = {}

  if (query.sort) {
    mediaListQuery.sort = query.sort
  } else {
    mediaListQuery.sort = 'top-past-week'
  }

  if (query.page) {
    mediaListQuery.page = query.page
  } else {
    mediaListQuery.page = 1
  }

  if (query.type === 'episodes') {    
    if (query.from === 'from-podcast') {
      mediaListQuery.podcast = mediaRef.podcastId
    } else if (query.from === 'subscribed-only') {
      mediaListQuery.podcast = subscribedPodcastIds
    } else { // from = all-podcasts
      // add nothing
    }
    return await getEpisodesByQuery(mediaListQuery)
  } else { // type = clips
    if (query.from === 'from-episode') {
      mediaListQuery.episodeId = mediaRef.episodeId
    } else if (query.from === 'all-podcasts') {
      // add nothing
    } else if (query.from === 'subscribed-only') {
      mediaListQuery.podcastId = subscribedPodcastIds
    } else {
      mediaListQuery.podcastId = mediaRef.podcastId
    }

    return await getMediaRefsByQuery(mediaListQuery)
  }
}

export const getQueryDataForEpisodePage = async (query, episode, subscribedPodcastIds) => {

}

export const getQueryDataForPodcastPage = async (query, podcast, subscribedPodcastIds) => {

}
