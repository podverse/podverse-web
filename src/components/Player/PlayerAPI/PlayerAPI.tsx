import { PlayerAPIAudio } from './PlayerAPIAudio'

type Props = unknown

export const PlayerAPI = (props: Props) => {
  /* Never initialize PlayerAPIs on the server-side. */
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <>
      <PlayerAPIAudio />
      {/* PlayerAPIVideo is rendered in the PlayerFullView component */}
    </>
  )
}
