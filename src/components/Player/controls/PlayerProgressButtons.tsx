import classnames from "classnames"
import { useOmniAural } from 'omniaural'
import { ButtonCircle } from "../.."
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons"
import { PlayerControlButton } from "./PlayerControlButton"
import { playerJumpBackward, playerJumpForward, playerPause, playerPlay } from "~/services/player/player"

type Props = {}

export const PlayerProgressButtons = (props: Props) => {
  const [player] = useOmniAural('player')
  const { paused } = player
  const container = classnames("progress-button-container")
  const playpause = classnames(paused ? "play" : "pause")

  const _handleTrackPrevious = () => {
    console.log('_handleTrackPrevious')
  }

  const _handleTimeJumpBackwards = () => {
    playerJumpBackward()
  }

  const _handleTogglePlay = () => {
    paused ? playerPlay() : playerPause()
  }

  const _handleTimeJumpForwards = () => {
    playerJumpForward()
  }

  const _handleTrackNext = () => {
    console.log('_handleTrackNext')
  }

  return (
    <div className={container}>
      <PlayerControlButton
        direction="backwards"
        onClick={_handleTrackPrevious}
        size="medium" 
        type="skip" />
      <PlayerControlButton
        direction="backwards"
        onClick={_handleTimeJumpBackwards}
        size="medium" 
        type="jump" />
      <ButtonCircle
        className={playpause}
        faIcon={paused ? faPlay : faPause}
        onClick={_handleTogglePlay}
        size={"medium"} />
      <PlayerControlButton
        direction="forwards"
        onClick={_handleTimeJumpForwards}
        size="medium"
        type="jump" />
      <PlayerControlButton
        direction="forwards"
        onClick={_handleTrackNext}
        size="medium"
        type="skip" />
    </div>
  )
}
