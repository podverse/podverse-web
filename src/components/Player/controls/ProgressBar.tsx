import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
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
  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { duration, playbackPosition } = player
  const currentTimeLabel = convertSecToHHMMSS(playbackPosition)
  const endTimeLabel = convertSecToHHMMSS(duration)

  const barContainer = classNames('player-bar-container', labelsBelow ? 'has-labels-below' : '')
  const bar = classNames('player-bar')
  const barLabel = classNames('player-bar-label')

  const flagPositions = clipFlagPositions.length > 0 ? clipFlagPositions : chapterFlagPositions

  const currentTimeElement = (
    <div aria-description={t('Current time')} className={barLabel} tabIndex={0}>
      {currentTimeLabel}
    </div>
  )
  const endTimeElement = (
    <div aria-description={t('Duration')} className={barLabel} tabIndex={0}>
      {endTimeLabel}
    </div>
  )

  return (
    <div className={barContainer}>
      {!labelsBelow && currentTimeElement}
      <Slider
        ariaHidden
        ariaLabel={t('Player progress bar')}
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
