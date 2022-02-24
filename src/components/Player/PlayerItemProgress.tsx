import classnames from 'classnames'
import { useOmniAural } from 'omniaural'
import { OmniAuralState } from '~/state/omniauralState'
import { PlayerProgressButtons } from './controls/PlayerProgressButtons'
import { ProgressBar } from './controls/ProgressBar'

type Props = unknown

export const PlayerItemProgress = (props: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { chapterFlagPositions, clipFlagPositions, highlightedPositions } = player
  const container = classnames('player-progress-container')

  return (
    <div className={container}>
      <PlayerProgressButtons />
      <ProgressBar
        chapterFlagPositions={chapterFlagPositions}
        clipFlagPositions={clipFlagPositions}
        highlightedPositions={highlightedPositions}
      />
    </div>
  )
}
