import classNames from "classnames"
import { useOmniAural } from 'omniaural'
import { Slider } from "~/components/Slider/Slider"
import { convertSecToHHMMSS } from "~/lib/utility/time"
import { playerSeekTo } from "~/services/player/player"

type Props = {}

export const ProgressBar = (props: Props) => {
  const [player] = useOmniAural('player')
  const { chapterFlagPositions, clipFlagPositions, duration, highlightedPositions,
    playbackPosition } = player
  const currentTimeLabel = convertSecToHHMMSS(playbackPosition)
  const endTimeLabel = convertSecToHHMMSS(duration)

  const barContainer = classNames("player-bar-container")
  const bar = classNames("player-bar")
  const barLabel = classNames("player-bar-label")

  const flagPositions = clipFlagPositions.length > 0
    ? clipFlagPositions
    : chapterFlagPositions

  return (
    <div className={barContainer}>
      <div className={barLabel}>{currentTimeLabel}</div>
      <Slider
        className={bar}
        currentValue={playbackPosition}
        endVal={duration}
        flagPositions={flagPositions}
        highlightedPositions={highlightedPositions}
        onValueChange={playerSeekTo}
        startVal={0} />
      <div className={barLabel}>{endTimeLabel}</div>
    </div>
  )
}
