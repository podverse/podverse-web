import classNames from "classnames"
import { useOmniAural } from 'omniaural'
import { useEffect } from "react"
import { Slider } from "~/components/Slider/Slider"
import { convertSecToHHMMSS } from "~/lib/utility/time"
import { playerUpdateDuration, playerUpdatePlaybackPosition } from "~/services/player/player"

type Props = {}

export const ProgressBar = (props: Props) => {
  const [player] = useOmniAural('player')
  const { duration, playbackPosition } = player
  const currentTimeLabel = convertSecToHHMMSS(playbackPosition)
  const endTimeLabel = convertSecToHHMMSS(duration)

  const barContainer = classNames("player-bar-container")
  const bar = classNames("player-bar")
  const barLabel = classNames("player-bar-label")

  useEffect(() => {
    const progressInterval = setInterval(() => {
      playerUpdatePlaybackPosition()
      playerUpdateDuration()
    }, 1000)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className={barContainer}>
      <div className={barLabel}>{currentTimeLabel}</div>
      <Slider
        className={bar}
        currentValue={playbackPosition}
        endVal={duration}
        startVal={0} />
      <div className={barLabel}>{endTimeLabel}</div>
    </div>
  )
}
