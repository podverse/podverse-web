import { parseTranscriptFile, TranscriptRow } from 'podverse-shared'
import { request } from './request'
import { PV } from '../resources'

export const getEpisodeProxyTranscript = async (episodeId: string, language?: string) => {
  let parsedTranscript = [] as TranscriptRow[]

  const endpoint = language
    ? `${PV.RoutePaths.api.episode}/${episodeId}/proxy/transcript/${language}`
    : `${PV.RoutePaths.api.episode}/${episodeId}/proxy/transcript`

  try {
    const response = await request({
      endpoint,
      method: 'get',
      opts: { timeout: 15000 }
    })
    const { data } = response
    if (data?.data && data?.type) {
      parsedTranscript = parseTranscriptFile(data.data, data.type)
    }
  } catch (error) {
    console.log('getParsedTranscript error:', error)
  }

  return parsedTranscript
}
