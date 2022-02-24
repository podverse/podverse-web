import { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import PlayerAudio from 'react-h5-audio-player'
import { playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioPause, audioSeekTo } from '~/services/player/playerAudio'
import { setClipFlagPositions } from '~/services/player/playerFlags'
import { OmniAuralState } from '~/state/omniauralState'

export const TwitterCardPlayerAPIAudio = () => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
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
      /*
        NOTE: I had to set preload to metadata to avoid bugs with WebViews
        refusing to handle changes to the <audio> currentTime properly.
        Apparently using preload auto in <audio> causes bugs in WebViews.
      */
      preload='metadata'
      onEnded={_onEnded}
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      onSeeked={_onListen}
      ref={window.playerAudio}
    />
  )
}
