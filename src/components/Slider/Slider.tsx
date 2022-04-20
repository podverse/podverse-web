import classNames from 'classnames'

type Props = {
  ariaHidden?: boolean
  ariaLabel?: string
  currentValue?: number
  className?: string
  endVal: number
  flagPositions?: number[]
  highlightedPositions?: number[]
  onValueChange?: (val: number) => void
  showFlags?: boolean
  startVal: number
  step?: number
}

export const Slider = ({
  ariaHidden,
  ariaLabel,
  className,
  currentValue = 0,
  endVal = 0,
  flagPositions = [],
  highlightedPositions = [],
  onValueChange,
  showFlags = false,
  startVal = 0,
  step = 1
}: Props) => {
  const slider = classNames('progress-slider', className)

  const generateFlagElements = () => {
    const flagElements = []
    for (const flagPosition of flagPositions) {
      flagElements.push(flagElement(flagPosition))
    }
    return flagElements
  }

  const flagElement = (flagPosition: number) => {
    const positionLeft = `${flagPosition * 100}%`
    const flagClassName = `flag${showFlags ? '' : ' display-none'}`
    return <div className={flagClassName} key={`flag-element-${flagPosition}`} style={{ left: positionLeft }} />
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
          }}
        />
      )
    }
    return null
  }

  const flagElements = generateFlagElements()
  const highlightedSectionElement = generateHighlightedSectionElement()
  const tabIndex = ariaHidden ? -1 : 0

  return (
    <div aria-hidden={ariaHidden} aria-label={ariaLabel} className={slider}>
      {flagElements}
      {highlightedSectionElement}
      <input
        min={startVal}
        max={endVal}
        onChange={(event) => {
          onValueChange && onValueChange(event.target.valueAsNumber)
        }}
        step={step}
        tabIndex={tabIndex}
        type='range'
        value={currentValue}
      />
    </div>
  )
}
