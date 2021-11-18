import classNames from "classnames"
import { Slider } from "~/components/Slider/Slider"
import { convertSecToHHMMSS } from "~/lib/utility/time"

type Props = {
  currentTime: number
  totalTime: number
}

export const ProgressBar = ({ currentTime, totalTime }: Props) => {
  const barContainer = classNames("player-bar-container")
  const bar = classNames("player-bar")
  const barLabel = classNames("player-bar-label")
  const currentTimeLabel = convertSecToHHMMSS(currentTime)
  const endTimeLabel = convertSecToHHMMSS(totalTime)

  return (
    <div className={barContainer}>
      <div className={barLabel}>{currentTimeLabel}</div>
      <Slider
        className={bar}
        currentVal={currentTime}
        startVal={0}
        endVal={totalTime}
      />
      <div className={barLabel}>{endTimeLabel}</div>
    </div>
  )
}
