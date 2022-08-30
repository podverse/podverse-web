import classNames from 'classnames'
import type { Episode, TranscriptRow } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { playerGetPosition, playerSeekTo } from '~/services/player/player'
import { getEpisodeProxyTranscript } from '~/services/transcript'
import { MainContentSection, SearchBarFilter } from '..'

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
  const [transcriptSearchRows, setTranscriptSearchRows] = useState<TranscriptRow[]>([])

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
      if (playbackPositionIntervalId) {
        clearInterval(playbackPositionIntervalId)
      }
      if (scrollToPositionIntervalId) {
        clearInterval(scrollToPositionIntervalId)
      }
    }
  }, [])

  const handleAutoScrollButton = () => {
    const newAutoScrollOn = !autoScrollOn
    setAutoScrollOn(newAutoScrollOn)
    if (newAutoScrollOn) {
      scrollToPositionIntervalId = setInterval(() => {
        const currentlyPlayingRow = document.querySelector(
          '.transcripts .transcripts-wrapper .transcript-row.currently-playing'
        )
        if (currentlyPlayingRow) {
          const rowHeight = currentlyPlayingRow.offsetHeight
          const topPos =
            currentlyPlayingRow.offsetTop >= rowHeight
              ? currentlyPlayingRow.offsetTop - rowHeight * 2
              : currentlyPlayingRow.offsetTop
          const transcriptsWrapper = document.querySelector('.transcripts-wrapper')
          if (transcriptsWrapper) {
            transcriptsWrapper.scrollTop = topPos
          }
        }
      }, 100)
    } else if (scrollToPositionIntervalId) {
      clearInterval(scrollToPositionIntervalId)
    }
  }

  const handleRowClick = (skipToTime: number) => {
    playerSeekTo(skipToTime)
  }

  const _handleSearchClear = () => {
    setTranscriptSearchRows([])
  }

  const _handleSearchSubmit = (searchText?: string) => {
    if (!searchText || searchText?.length === 0) {
      _handleSearchClear()
    } else {
      const searchResults = transcriptRows.filter((item: Record<string, any>) => {
        return item?.text?.toLowerCase().includes(searchText?.toLowerCase())
      })

      setAutoScrollOn(false)
      if (scrollToPositionIntervalId) {
        clearInterval(scrollToPositionIntervalId)
      }

      if (searchResults.length === 0) {
        searchResults.push({
          text: t('No results found')
        } as any)
      }

      setTranscriptSearchRows(searchResults)
    }
  }

  const generateTranscriptRowNode = (transcriptRow: TranscriptRow) => {
    if (!transcriptRow) return null

    const rowClassName = classNames('transcript-row', {
      'currently-playing':
        (currentPlaybackPosition < 1 && Math.floor(transcriptRow.endTime) <= 1) ||
        (currentPlaybackPosition >= transcriptRow.startTime &&
          currentPlaybackPosition < transcriptRow.endTime)
    })

    return (
      <div className={rowClassName} onClick={() => handleRowClick(transcriptRow.startTime)}>
        <div className='transcript-row__text'>{transcriptRow.text}</div>
        <div className='transcript-row__time'>{transcriptRow.startTimeHHMMSS}</div>
      </div>
    )
  }

  const transcriptRowNodes = transcriptSearchRows?.length > 0
    ? (transcriptSearchRows?.map(generateTranscriptRowNode) || [])
    : (transcriptRows?.map(generateTranscriptRowNode) || [])
  
  return (
    <div className='transcripts'>
      <MainContentSection
        handleAutoScrollButton={handleAutoScrollButton}
        headerText={t('Transcript')}
        isAutoScrollOn={autoScrollOn}
        isLoading={transcriptRowsLoading}
      >
        <SearchBarFilter
          handleClear={_handleSearchClear}
          handleSubmit={_handleSearchSubmit}
          placeholder={t('Transcript search')}
          smaller
        />
        <div className='transcripts-wrapper'>{transcriptRowNodes}</div>
      </MainContentSection>
      <hr />
    </div>
  )
}
