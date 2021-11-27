import { createRef, useEffect } from 'react'
import PlayerAudio from 'react-h5-audio-player'
import { playerUpdateDuration, playerUpdatePlaybackPosition } from '~/services/player/player'
import { audioInitialize } from '~/services/player/playerAudio'

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

  useEffect(() => {
    audioInitialize()
  }, [])

  const _onListen = () => {
    playerUpdatePlaybackPosition()
    playerUpdateDuration()
  }

  window.playerAudio = createRef()

  return (
    <PlayerAudio
      onListen={_onListen}
      ref={window.playerAudio} />
  )
}
