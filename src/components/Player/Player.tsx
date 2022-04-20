import { useOmniAural } from 'omniaural'
import classnames from 'classnames'
import { PlayerFullView } from './PlayerFullView'
import { PlayerItemInfo } from './PlayerItemInfo'
import { PlayerItemButtons } from './PlayerItemOptions'
import { PlayerItemProgress } from './PlayerItemProgress'
import { OmniAuralState } from '~/state/omniauralState'
import { useTranslation } from 'next-i18next'

type Props = unknown

export const Player = (props: Props) => {
  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]

  const mainPlayerStyle = classnames('player', player.show ? '' : 'display-none')

  if (!player?.currentNowPlayingItem) {
    return null
  }

  return (
    <>
      <aside aria-label={t('Media player controls')} className={mainPlayerStyle}>
        <PlayerItemInfo nowPlayingItem={player.currentNowPlayingItem} />
        <PlayerItemProgress />
        <PlayerItemButtons />
      </aside>
      <PlayerFullView nowPlayingItem={player.currentNowPlayingItem} />
    </>
  )
}
