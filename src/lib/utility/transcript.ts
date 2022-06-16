import { Transcript } from 'podverse-shared'

export const generateReactVideoTranscriptTracks = (transcripts: Transcript[], defaultTranscript: Transcript) => {
  const tracks = []

  if (transcripts?.length > 0) {
    for (const transcript of transcripts) {
      if (transcript.url?.endsWith('.vtt')) {
        const track = {
          kind: 'subtitles',
          src: transcript.url,
          srcLang: transcript.language,
          default: transcript.language === defaultTranscript.language
        }

        tracks.push(track)
      }
    }
  }

  return tracks
}
