import OmniAural, { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { retrieveLatestChaptersForEpisodeId } from '~/services/mediaRef'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { videoInitialize, videoPause, videoPlay, videoSeekTo } from '~/services/player/playerVideo'
import { enrichChapterDataForPlayer, handleChapterUpdateInterval } from '~/services/player/playerChapters'
import { generateChapterFlagPositions, setClipFlagPositions } from '~/services/player/playerFlags'
import { addOrUpdateHistoryItemOnServer } from '~/services/userHistoryItem'
import { OmniAuralState } from '~/state/omniauralState'

// TODO: temporarily using require instead of require to work around a build error happening
// in the Github action pipeline: "'PlayerAudio' cannot be used as a JSX component."
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PlayerVideo = require('react-player').default

type Props = unknown

export const PlayerAPIVideo = (props: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  // const [historyItemsIndex] = useOmniAural('historyItemsIndex')
  const historyItemsIndex = OmniAural.state.historyItemsIndex.value()
  const { currentNowPlayingItem, muted, paused, playSpeed, video, volume } = player
  const { src } = video

  useEffect(() => {
    videoInitialize()
  }, [])

  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const _onEnded = () => {
    addOrUpdateHistoryItemOnServer({
      nowPlayingItem: currentNowPlayingItem,
      playbackPosition: 0,
      mediaFileDuration: playerGetDuration(),
      forceUpdateOrderDate: false,
      skipSetNowPlaying: true,
      completed: true
    })
  }

  const _onLoadedMetaData = async () => {
    if (currentNowPlayingItem.clipStartTime) {
      videoSeekTo(currentNowPlayingItem.clipStartTime)
    }
    const duration = playerGetDuration()

    const historyItem = historyItemsIndex.episodes[currentNowPlayingItem.episodeId]

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      setClipFlagPositions(currentNowPlayingItem, duration)
    } else if (historyItem) {
      videoSeekTo(historyItem.p)
    }

    const playbackPosition = currentNowPlayingItem.clipStartTime || historyItem?.p || 0

    addOrUpdateHistoryItemOnServer({
      nowPlayingItem: currentNowPlayingItem,
      playbackPosition,
      mediaFileDuration: duration,
      forceUpdateOrderDate: true,
      skipSetNowPlaying: false
    })

    if (currentNowPlayingItem.episodeChaptersUrl) {
      const data = await retrieveLatestChaptersForEpisodeId(currentNowPlayingItem.episodeId)
      const [chapters] = data
      const enrichedChapters = enrichChapterDataForPlayer(chapters, duration)
      const chapterFlagPositions = generateChapterFlagPositions(enrichedChapters, duration)
      OmniAural.setChapterFlagPositions(chapterFlagPositions)
      OmniAural.setChapters(enrichedChapters)
    }
  }

  const _onListen = () => {
    unstable_batchedUpdates(() => {
      playerUpdatePlaybackPosition()
      playerUpdateDuration()
      handleChapterUpdateInterval()
    })
  }

  window.playerVideo = createRef()

  // https://github.com/CookPete/react-player#config-prop
  const playerVideoConfig = () => {
    let config: any = {}

    if (src?.indexOf('.m3u8') >= 0) {
      config = {
        file: {
          // NOTE: I don't remember why I set this forceHLS property originally,
          // but when set to true, m3u8 files failed to play in iOS Safari.
          // Commenting it out for now.
          // forceHLS: true,
          hlsOptions: {
            liveDurationInfinity: true
          }
        }
      }
    }

    // if (currentNowPlayingItem?.episodeTranscript?.length > 0) {
    //   const transcripts = currentNowPlayingItem.episodeTranscript

    //   const defaultTranscript = getTranscriptForLocale(transcripts, navigator.language)
    //   const tracks = generateReactVideoTranscriptTracks(transcripts, defaultTranscript)

    //   config = {
    //     ...config,
    //     file: {
    //       ...config.file,
    //       tracks
    //     }
    //   }
    // }

    return config
  }

  return (
    <div className='video-player-wrapper'>
      <PlayerVideo
        config={playerVideoConfig()}
        controls
        onDuration={_onLoadedMetaData}
        onEnded={_onEnded}
        onError={(error) => console.log('video playback error:', error)}
        onPause={videoPause}
        onPlay={videoPlay}
        onSeek={_onListen}
        onProgress={_onListen}
        muted={muted}
        playbackRate={playSpeed}
        playing={!paused}
        ref={(ref) => {
          window.playerVideo = ref
        }}
        url={src}
        volume={volume ? volume / 100 : 0}
      />
    </div>
  )
}
