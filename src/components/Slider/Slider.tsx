import classNames from "classnames"
import OmniAural from 'omniaural'
import { playerSeekTo } from "~/services/player/player"

type Props = {
  currentValue?: number
  className?: string
  endVal: number
  onValueChange?: (val: number) => void
  startVal: number
  step?: number
}

export const Slider = ({
  className,
  currentValue = 0,
  endVal,
  onValueChange,
  startVal,
  step = 1
}: Props) => {
  const slider = classNames("progress-slider", className)

  return (
    <div className={slider}>
      <input
        min={startVal}
        max={endVal}
        onChange={(event) => {
          const { valueAsNumber } = event.target
          playerSeekTo(valueAsNumber)
          onValueChange && onValueChange(valueAsNumber)
        }}
        step={step}
        type="range"
        value={currentValue}
      />
    </div>
  )
}
