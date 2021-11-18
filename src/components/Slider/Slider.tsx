import { useState } from "react"
import classNames from "classnames"

type Props = {
  startVal: number
  endVal: number
  currentVal?: number
  step?: number
  className?: string
  onValueChange?: (val: number) => void
}

export const Slider = ({
  startVal,
  endVal,
  step = 1,
  currentVal = 0,
  className,
  onValueChange,
}: Props) => {
  const [currentValue, setCurrentValue] = useState(currentVal)
  const slider = classNames("progress-slider", className)

  return (
    <div className={slider}>
      <input
        type="range"
        min={startVal}
        max={endVal}
        step={step}
        value={currentValue}
        onChange={(event) => {
          setCurrentValue(event.target.valueAsNumber)
          onValueChange && onValueChange(event.target.valueAsNumber)
        }}
      />
    </div>
  )
}
