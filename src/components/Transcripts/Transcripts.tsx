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

let scrollToPositionIntervalId: any = null
let playbackPositionIntervalId: any = null
const playbackPositionIntervalTime = 0.5 // seconds

export const Transcripts = ({ episode }: Props) => {
  const { t } = useTranslation()
  const [autoScrollOn, setAutoScrollOn] = useState<boolean>(false)
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = useState<number>(0)
  const [transcriptRows, setTranscriptRows] = useState<TranscriptRow[]>([])
  const [transcriptRowsLoading, setTranscriptRowsLoading] = useState<boolean>(false)

  useEffect(() => {
    const transcriptTag = episode?.transcript && episode?.transcript[0]

    ;(async () => {
      if (transcriptTag) {
        setTranscriptRowsLoading(true)
        const parsedTranscriptRows = await getEpisodeProxyTranscript(episode.id)
        setTranscriptRows(parsedTranscriptRows)
        setTranscriptRowsLoading(false)
      }
    })()

    if (transcriptTag) {
      playbackPositionIntervalId = setInterval(() => {
        const playbackPosition = playerGetPosition()
        setCurrentPlaybackPosition(playbackPosition)
      }, playbackPositionIntervalTime * 1000)
    }

    return () => {
      clearInterval(playbackPositionIntervalId)
      clearInterval(scrollToPositionIntervalId)
    }
  }, [])

  const handleAutoScrollButton = () => {
    const newAutoScrollOn = !autoScrollOn
    setAutoScrollOn(newAutoScrollOn)
    if (newAutoScrollOn) {
      scrollToPositionIntervalId = setInterval(() => {
        const currentlyPlayingRow = document.querySelector('.transcripts .transcripts-wrapper .transcript-row.currently-playing')
        if (currentlyPlayingRow) {
          const rowHeight = currentlyPlayingRow.offsetHeight
          const topPos = currentlyPlayingRow.offsetTop >= rowHeight
            ? currentlyPlayingRow.offsetTop - (rowHeight * 2)
            : currentlyPlayingRow.offsetTop
          const transcriptsWrapper = document.querySelector('.transcripts-wrapper')
          if (transcriptsWrapper) {
            transcriptsWrapper.scrollTop = topPos
          }
        }
      }, 100)
    } else {
      clearInterval(scrollToPositionIntervalId)
    }
  }

  const handleRowClick = (skipToTime: number) => {
    playerSeekTo(skipToTime)
  }

  const generateTranscriptRowNode = (transcriptRow: TranscriptRow) => {
    if (!transcriptRow) return null

    const playbackPositionWithIntervalLag = currentPlaybackPosition - playbackPositionIntervalTime

    const rowClassName = classNames(
      'transcript-row',
      {
        'currently-playing':
          currentPlaybackPosition < 1 && Math.floor(transcriptRow.endTime) <= 1
          || (
            playbackPositionWithIntervalLag >= transcriptRow.startTime && playbackPositionWithIntervalLag < transcriptRow.endTime
          )
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
