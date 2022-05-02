import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { Slider } from '~/components/Slider/Slider'
import { convertSecToHHMMSS } from '~/lib/utility/time'
import { playerResetLiveItemAndResumePlayback, playerSeekTo } from '~/services/player/player'
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
  const { currentNowPlayingItem, duration, isAtCurrentLiveStreamTime, playbackPosition } = player
  const isLiveItem = !!currentNowPlayingItem.liveItem

  const currentTimeLabel = convertSecToHHMMSS(playbackPosition)
  const endTimeTextLabel = convertSecToHHMMSS(duration, isLiveItem, t)
  const endTimeLabel = isAtCurrentLiveStreamTime ? `${endTimeTextLabel} ●` : endTimeTextLabel

  const barContainer = classNames('player-bar-container', labelsBelow ? 'has-labels-below' : '')
  const bar = classNames('player-bar')
  const currentTimeBarLabel = classNames('player-bar-label current-time')
  const endTimeBarLabel = classNames(
    'player-bar-label end-time',
    isLiveItem ? 'is-live-item' : '',
    isAtCurrentLiveStreamTime ? 'is-at-current-live-position' : ''
  )

  const flagPositions = clipFlagPositions.length > 0 ? clipFlagPositions : chapterFlagPositions

  const currentTimeElement = (
    <div aria-description={t('Current time')} className={currentTimeBarLabel} tabIndex={0}>
      {currentTimeLabel}
    </div>
  )
  const endTimeAriaDescription = isLiveItem ? t('Go to current live time') : t('Duration')
  const endTimeAriaRole = isLiveItem ? 'button' : 'none'
  const endTimeOnClick = isLiveItem ? playerResetLiveItemAndResumePlayback : null
  const endTimeElement = (
    <button
      aria-description={endTimeAriaDescription}
      aria-role={endTimeAriaRole}
      className={endTimeBarLabel}
      onClick={endTimeOnClick}
      tabIndex={0}
    >
      {endTimeLabel}
    </button>
  )

  return (
    <div className={barContainer}>
      {!labelsBelow && currentTimeElement}
      <Slider
        ariaHidden
        ariaLabel={t('Player progress bar')}
        className={bar}
        currentValue={isLiveItem ? 0 : playbackPosition}
        endVal={duration}
        flagPositions={flagPositions}
        highlightedPositions={highlightedPositions}
        onValueChange={isLiveItem ? null : playerSeekTo}
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
