import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import { useOmniAural } from 'omniaural'
import { playerJumpBackward, playerJumpForward } from "~/services/player/player"
import { audioCheckIfCurrentlyPlaying, audioIsLoaded, audioPause, audioPlay } from "~/services/player/playerAudio"
import { ButtonCircle } from ".."
import { PlayerControlButton } from "../Player/controls/PlayerControlButton"
import { ProgressBar } from "../Player/controls/ProgressBar"

export const EmbedPlayer = () => {
  const [player] = useOmniAural('player')
  const { paused } = player
  const playpause = classNames(paused ? 'play' : 'pause')

  const _handleTogglePlay = () => {
    if (audioIsLoaded()) {
      audioCheckIfCurrentlyPlaying() ? audioPause() : audioPlay()
    }
  }

  const _handleTimeJumpBackwards = () => {
    playerJumpBackward()
  }

  const _handleTimeJumpForwards = () => {
    playerJumpForward()
  }

  return (
    <div className='embed-player'>
      <div className='embed-progress-bar-wrapper'>
        <ProgressBar
          chapterFlagPositions={[]}
          clipFlagPositions={[]}
          highlightedPositions={[]}
        />
      </div>
      <div className='player-buttons'>
        <PlayerControlButton direction='backwards' onClick={_handleTimeJumpBackwards} size='medium' type='jump' />
        <ButtonCircle
          className={playpause}
          faIcon={paused ? faPlay : faPause}
          onClick={_handleTogglePlay}
          size={'medium'}
        />
        <PlayerControlButton direction='forwards' onClick={_handleTimeJumpForwards} size='medium' type='jump' />
      </div>
    </div>
  )
}
