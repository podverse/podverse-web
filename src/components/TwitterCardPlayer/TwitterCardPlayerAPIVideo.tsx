import { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { videoInitialize, videoPause, videoPlay, videoSeekTo } from '~/services/player/playerVideo'
import { setClipFlagPositions } from '~/services/player/playerFlags'

// TODO: temporarily using require instead of require to work around a build error happening
// in the Github action pipeline: "'PlayerAudio' cannot be used as a JSX component."
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PlayerVideo = require('react-player')

export const TwitterCardPlayerAPIVideo = () => {
  const [player] = useOmniAural('player')
  const { currentNowPlayingItem, paused, playSpeed, video } = player
  const { src } = video

  useEffect(() => {
    videoInitialize()
  }, [])

  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const _onEnded = () => {
    videoPause()
  }

  const _onLoadedMetaData = async () => {
    if (currentNowPlayingItem.clipStartTime) {
      videoSeekTo(currentNowPlayingItem.clipStartTime)
    }

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      const duration = playerGetDuration()
      setClipFlagPositions(currentNowPlayingItem, duration)
    }

    playerUpdateDuration()
  }

  const _onListen = () => {
    playerUpdatePlaybackPosition()
    playerUpdateDuration()
  }

  window.playerAudio = createRef()

  return (
    <div className='twitter-video-player-wrapper'>
      <PlayerVideo
        controls
        onEnded={_onEnded}
        onDuration={_onLoadedMetaData}
        onPause={videoPause}
        onPlay={videoPlay}
        onSeek={_onListen}
        onProgress={_onListen}
        playbackRate={playSpeed}
        playing={!paused}
        ref={(ref) => {
          window.playerVideo = ref
        }}
        height='100%'
        width='100%'
        url={src}
        volume={1}
      />
    </div>
  )
}
