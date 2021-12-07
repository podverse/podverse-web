import { PlayerAPIAudio } from './PlayerAPIAudio'
import { PlayerAPIVideo } from './PlayerAPIVideo'

type Props = unknown

export const PlayerAPI = (props: Props) => {
  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <>
      <PlayerAPIAudio />
      <PlayerAPIVideo />
    </>
  )
}
