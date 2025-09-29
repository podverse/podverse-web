import { formatHHMMSS, TranscriptRow } from 'podverse-helpers'
import { convertFile } from 'transcriptator'
import { TimestampFormatter } from 'transcriptator/timestamp'

export const getTranscriptRowsFromTranscriptString = async (data?: string | null) => {
  let parsedTranscript = [] as TranscriptRow[]
  
  if (!data) {
    return parsedTranscript;
  }

  try {
    TimestampFormatter.registerCustomFormatter(formatHHMMSS)
    parsedTranscript = convertFile(data)

    let previousSpeaker = ''
    for (const row of parsedTranscript) {
      if (row?.speaker && previousSpeaker === row.speaker) {
        row.speaker = ''
      } else if (row?.speaker) {
        previousSpeaker = row.speaker
      }
    }
  } catch (error) {
    console.log('getParsedTranscript error:', error)
  }

  return parsedTranscript || [];
}
