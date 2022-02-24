import classNames from 'classnames'
import { useOmniAural } from 'omniaural'
import { Slider } from '~/components/Slider/Slider'
import { convertSecToHHMMSS } from '~/lib/utility/time'
import { playerSeekTo } from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'

type Props = {
  chapterFlagPositions?: number[]
  clipFlagPositions: number[]
  highlightedPositions: number[]
  labelsBelow?: boolean
}

export const ProgressBar = ({
  chapterFlagPositions = [],
  clipFlagPositions = [],
  highlightedPositions = [],
  labelsBelow
}: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { duration, playbackPosition } = player
  const currentTimeLabel = convertSecToHHMMSS(playbackPosition)
  const endTimeLabel = convertSecToHHMMSS(duration)

  const barContainer = classNames('player-bar-container', labelsBelow ? 'has-labels-below' : '')
  const bar = classNames('player-bar')
  const barLabel = classNames('player-bar-label')

  const flagPositions = clipFlagPositions.length > 0 ? clipFlagPositions : chapterFlagPositions

  const currentTimeElement = <div className={barLabel}>{currentTimeLabel}</div>
  const endTimeElement = <div className={barLabel}>{endTimeLabel}</div>

  return (
    <div className={barContainer}>
      {!labelsBelow && currentTimeElement}
      <Slider
        className={bar}
        currentValue={playbackPosition}
        endVal={duration}
        flagPositions={flagPositions}
        highlightedPositions={highlightedPositions}
        onValueChange={playerSeekTo}
        showFlags={(!clipFlagPositions || clipFlagPositions.length === 0) && chapterFlagPositions?.length > 1}
        startVal={0}
      />
      {!labelsBelow && endTimeElement}
      {labelsBelow && (
        <div className='player-bar-labels-below'>
          {currentTimeElement}
          {endTimeElement}
        </div>
      )}
    </div>
  )
}
