import { Episode, Podcast } from 'podverse-shared'
import { PV } from '~/resources'

export const calcListPageCount = (itemCount: number) => {
  return Math.ceil(itemCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
}

export const getClipTitle = (t: any, clipTitle: string, episodeTitle: string) => {
  return clipTitle || `(${t('Clip')}) ${episodeTitle || t('untitledEpisode')}`
}

export const getEpisodeTitle = (t: any, episode: Episode) => {
  return episode.title || t('untitledEpisode')
}

export const getPodcastTitle = (t: any, podcast: Podcast) => {
  return podcast.title || t('untitledPodcast')
}

export const prefixClipLabel = (t: any, episodeTitle?: string) => {
  let title = ''
  if (episodeTitle) {
    title = `(${t('Clip')}) ${episodeTitle}`.trim()
  } else {
    title = t('untitledClip')
  }
  return title
}
