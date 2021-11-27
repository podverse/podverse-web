import OmniAural, { useOmniAural } from 'omniaural'
import { createRef, useEffect } from 'react'
import PlayerAudio from 'react-h5-audio-player'
import { generateClipFlagPositions, generateFlagPositions, playerGetDuration, playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize, audioSeekTo } from '~/services/player/playerAudio'

type Props = {}

declare global {
  /* *TODO* add playerAudio type */
  interface Window { playerAudio: any }
}

export const PlayerAPIAudio = (props: Props) => {
  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  const [player] = useOmniAural('player')
  const { currentNowPlayingItem } = player

  useEffect(() => {
    audioInitialize()
  }, [])

  const _onLoadedMetaData = () => {
    if (currentNowPlayingItem.clipStartTime) {
      audioSeekTo(currentNowPlayingItem.clipStartTime)
    }

    const duration = playerGetDuration()

    if (Number.isInteger(currentNowPlayingItem.clipStartTime)) {
      const flagPositions = generateClipFlagPositions(
        currentNowPlayingItem, duration
      )
      OmniAural.setFlagPositions(flagPositions)
      OmniAural.setHighlightedPositions(flagPositions)
    } else if (false) {
      // handle has chapters
    }
  }

  const _onListen = () => {
    playerUpdatePlaybackPosition()
    playerUpdateDuration()
  }

  window.playerAudio = createRef()

  return (
    <PlayerAudio
      onLoadedMetaData={_onLoadedMetaData}
      onListen={_onListen}
      ref={window.playerAudio} />
  )
}
