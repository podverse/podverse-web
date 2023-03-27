import { convertSecToHHMMSS, TranscriptRow } from 'podverse-shared'
import { convertFile } from 'transcriptator'
import { timestampFormatter } from 'transcriptator/timestamp'
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
      timestampFormatter.registerCustomFormatter(convertSecToHHMMSS)
      parsedTranscript = convertFile(data.data)
    }
  } catch (error) {
    console.log('getParsedTranscript error:', error)
  }

  return parsedTranscript
}
