import { PV } from "~/resources"

export const calcListPageCount = (itemCount: number) => {
  return Math.ceil(itemCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
}

export const getMediaRefTitle = (t: any, mediaRef: any, episodeTitle: string) => {
  return mediaRef.title || `(${t('Clip')}) ${episodeTitle || t('untitledEpisode')}`
}
