import { Episode, MediaRef } from 'podverse-shared'
import { PV } from "~/resources"

export const calcListPageCount = (itemCount: number) => {
  return Math.ceil(itemCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
}

export const getClipTitle = (t: any, mediaRef: MediaRef, episodeTitle: string) => {
  return mediaRef.title || `(${t('Clip')}) ${episodeTitle || t('untitledEpisode')}`
}

export const getEpisodeTitle = (t: any, episode: Episode) => {
  return episode.title || t('untitledEpisode')
}
