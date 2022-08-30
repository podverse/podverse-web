import type { Episode, TranscriptRow } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { playerSeekTo } from '~/services/player/player'
import { getEpisodeProxyTranscript } from '~/services/transcript'
import { MainContentSection } from '..'

type Props = {
  episode?: Episode
}

export const Transcripts = ({ episode }: Props) => {
  const { t } = useTranslation()
  const [autoScrollOn, setAutoScrollOn] = useState<boolean>(false)
  const [transcriptRowNodes, setTranscriptRowNodes] = useState<TranscriptRow[]>([])
  const [transcriptRowsLoading, setTranscriptRowsLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const transcriptTag = episode?.transcript && episode?.transcript[0]
      if (transcriptTag) {
        setTranscriptRowsLoading(true)
        const parsedTranscriptRows = await getEpisodeProxyTranscript(episode.id)
        const parsedTranscriptRowNodes = []
        if (parsedTranscriptRows && parsedTranscriptRows.length > 0) {
          for (const transcriptRow of parsedTranscriptRows) {
            parsedTranscriptRowNodes.push(generateTranscriptRowNode(transcriptRow))
          }
        }
        setTranscriptRowNodes(parsedTranscriptRowNodes)
        setTranscriptRowsLoading(false)
      }
    })()
  }, [])

  const handleAutoScrollButton = () => {
    setAutoScrollOn(!autoScrollOn)
  }

  const handleRowClick = (skipToTime: number) => {
    playerSeekTo(skipToTime)
  }

  const generateTranscriptRowNode = (transcriptRow: TranscriptRow) => {
    if (!transcriptRow) return null

    return (
      <div className='transcript-row' onClick={() => handleRowClick(transcriptRow.startTime)}>
        <div className='transcript-row__text'>{transcriptRow.text}</div>
        <div className='transcript-row__time'>{transcriptRow.startTimeHHMMSS}</div>
      </div>
    )
  }

  return (
    <div className='transcripts'>
      <MainContentSection
        handleAutoScrollButton={handleAutoScrollButton}
        headerText={t('Transcript')}
        isAutoScrollOn={autoScrollOn}
        isLoading={transcriptRowsLoading}
      >
        <div className='transcripts-wrapper'>{transcriptRowNodes}</div>
      </MainContentSection>
      <hr />
    </div>
  )
}
