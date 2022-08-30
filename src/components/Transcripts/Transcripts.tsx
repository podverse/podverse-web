import classNames from 'classnames'
import OmniAural from 'omniaural'
import type { Episode, TranscriptRow } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { playerGetPosition, playerSeekTo } from '~/services/player/player'
import { getEpisodeProxyTranscript } from '~/services/transcript'
import { MainContentSection } from '..'

type Props = {
  episode?: Episode
}

export const Transcripts = ({ episode }: Props) => {
  const { t } = useTranslation()
  const [autoScrollOn, setAutoScrollOn] = useState<boolean>(false)
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = useState<number>(0)
  const [transcriptRows, setTranscriptRows] = useState<TranscriptRow[]>([])
  const [transcriptRowsLoading, setTranscriptRowsLoading] = useState<boolean>(false)

  useEffect(() => {
    let playbackPositionIntervalId: any = null
    const transcriptTag = episode?.transcript && episode?.transcript[0]

    ;(async () => {
      if (transcriptTag) {
        setTranscriptRowsLoading(true)
        const parsedTranscriptRows = await getEpisodeProxyTranscript(episode.id)
        setTranscriptRows(parsedTranscriptRows)
        setTranscriptRowsLoading(false)

        playbackPositionIntervalId = setInterval(() => {
          const currentNowPlayingItem = OmniAural.state.player.currentNowPlayingItem.value()
          if (currentNowPlayingItem?.episodeId && currentNowPlayingItem?.episodeId === episode.id) {
            const playbackPosition = playerGetPosition()
            setCurrentPlaybackPosition(playbackPosition)
          }
        }, 1000)
      }
    })()

    if (transcriptTag) {
      playbackPositionIntervalId = setInterval(() => {
        const playbackPosition = playerGetPosition()
        setCurrentPlaybackPosition(playbackPosition)
      }, 1000)
    }

    return () => clearInterval(playbackPositionIntervalId)
  }, [])

  const handleAutoScrollButton = () => {
    setAutoScrollOn(!autoScrollOn)
  }

  const handleRowClick = (skipToTime: number) => {
    playerSeekTo(skipToTime)
  }

  const generateTranscriptRowNode = (transcriptRow: TranscriptRow) => {
    if (!transcriptRow) return null

    const floorPlaybackPosition = Math.floor(currentPlaybackPosition + 1)

    const rowClassName = classNames(
      'transcript-row',
      {
        'currently-playing': floorPlaybackPosition > Math.floor(transcriptRow.startTime) && floorPlaybackPosition < Math.ceil(transcriptRow.endTime)
      }
    )

    return (
      <div className={rowClassName} onClick={() => handleRowClick(transcriptRow.startTime)}>
        <div className='transcript-row__text'>{transcriptRow.text}</div>
        <div className='transcript-row__time'>{transcriptRow.startTimeHHMMSS}</div>
      </div>
    )
  }

  const transcriptRowNodes = []
  if (transcriptRows && transcriptRows.length > 0) {
    for (const transcriptRow of transcriptRows) {
      transcriptRowNodes.push(generateTranscriptRowNode(transcriptRow))
    }
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
