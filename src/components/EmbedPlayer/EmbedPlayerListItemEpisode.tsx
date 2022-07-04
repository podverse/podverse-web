import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { convertToNowPlayingItem, Episode, Podcast } from 'podverse-shared'
import { ButtonCircle } from '~/components/Buttons/ButtonCircle'
import { generateItemTimeInfo } from '~/lib/utility/date'
import { playerCheckIfItemIsCurrentlyPlaying, playerTogglePlayOrLoadNowPlayingItem } from '~/services/player/player'
import { LiveStatusBadge } from '../LiveStatusBadge/LiveStatusBadge'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'
import { PVLink } from '../PVLink/PVLink'

type Props = {
  episode: Episode
  podcast: Podcast
}

export const EmbedPlayerListItemEpisode = ({ episode, podcast }: Props) => {
  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { paused } = player
  const nowPlayingItem = convertToNowPlayingItem(episode)
  const { liveItem } = episode
  const episodeTitle = episode.title || t('untitledEpisode')
  const { pubDate, timeInfo } = generateItemTimeInfo(t, episode)
  const isCurrentlyPlayingItem = playerCheckIfItemIsCurrentlyPlaying(paused, nowPlayingItem)
  const togglePlayIcon = isCurrentlyPlayingItem ? faPause : faPlay
  const togglePlayClassName = isCurrentlyPlayingItem ? 'pause' : 'play'
  const togglePlayAriaLabel = isCurrentlyPlayingItem ? t('Pause this episode') : t('Play this episode')

  const _handleTogglePlayOrLoad = () => {
    const inheritedEpisode = null
    const nowPlayingItem = convertToNowPlayingItem(episode, inheritedEpisode, podcast)
    playerTogglePlayOrLoadNowPlayingItem(nowPlayingItem)
  }

  return (
    <div className='embed-player-list-item-episode'>
      <ButtonCircle
        ariaLabel={togglePlayAriaLabel}
        ariaPressed
        className={togglePlayClassName}
        faIcon={togglePlayIcon}
        onClick={_handleTogglePlayOrLoad}
        size={'small'}
      />
      <div className='embed-player-text-wrapper'>
        <div className='embed-player-list-item-episode-title'>
          <PVLink href={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${episode.id}`} target='_blank'>
            {episodeTitle}
          </PVLink>
        </div>
        <div className='embed-player-list-item-time-wrapper'>
          <span className='embed-player-list-item-episode-pub-date'>{pubDate}</span>
          {!!timeInfo && (
            <>
              <span className='embed-player-list-item-time-spacer'> • </span>
              <span className='embed-player-list-item-time-info'>{timeInfo}</span>
            </>
          )}
        </div>
      </div>
      {!!liveItem && <LiveStatusBadge liveItemStatus={liveItem.status} />}
    </div>
  )
}
