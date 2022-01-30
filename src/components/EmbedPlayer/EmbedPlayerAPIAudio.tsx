import { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import PlayerAudio from 'react-h5-audio-player'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioPause, audioSeekTo } from '~/services/player/playerAudio'
import { setClipFlagPositions } from '~/services/player/playerFlags'

export const EmbedPlayerAPIAudio = () => {
  const [player] = useOmniAural('player')
  const { currentNowPlayingItem } = player

  useEffect(() => {
    audioInitialize()
  }, [])

  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const _onEnded = () => {
    audioPause()
  }

  const _onLoadedMetaData = async () => {
    if (currentNowPlayingItem.clipStartTime) {
      audioSeekTo(currentNowPlayingItem.clipStartTime)
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
    <PlayerAudio
      onEnded={_onEnded}
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      onSeeked={_onListen}
      ref={window.playerAudio}
    />
  )
}
