import classNames from "classnames"

type Props = {
  currentValue?: number
  className?: string
  endVal: number
  flagPositions?: number[]
  highlightedPositions?: number[]
  onValueChange?: (val: number) => void
  startVal: number
  step?: number
}

export const Slider = ({
  className,
  currentValue = 0,
  endVal = 0,
  flagPositions = [],
  highlightedPositions = [],
  onValueChange,
  startVal = 0,
  step = 1
}: Props) => {
  const slider = classNames("progress-slider", className)

  const generateFlagElements = () => {
    const flagElements = []
    for (const flagPosition of flagPositions) {
      flagElements.push(flagElement(flagPosition))
    }
    return flagElements
  }

  const flagElement = (flagPosition: number) => {
    const positionLeft = `${flagPosition * 100}%`
    return (
      <div
        className='flag'
        key={`flag-element-${flagPosition}`}
        style={{ left: positionLeft }} />
    )
  }

  const generateHighlightedSectionElement = () => {
    if (highlightedPositions?.length === 2) {
      const [startPosition, endPosition] = highlightedPositions
      const positionLeft = `${startPosition * 100}%`
      const width = `${(endPosition - startPosition) * 100}%`
      return (
        <div
          className='highlighted-section'
          style={{
            left: positionLeft,
            width
          }} />
      )
    }
    return null
  }

  const flagElements = generateFlagElements()
  const highlightedSectionElement = generateHighlightedSectionElement()

  return (
    <div className={slider}>
      {flagElements}
      {highlightedSectionElement}
      <input
        min={startVal}
        max={endVal}
        onChange={(event) => {          
          onValueChange && onValueChange(event.target.valueAsNumber)
        }}
        step={step}
        type="range"
        value={currentValue}
      />
    </div>
  )
}
