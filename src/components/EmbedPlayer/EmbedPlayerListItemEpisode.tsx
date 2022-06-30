import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "next-i18next"
import { convertToNowPlayingItem, Episode } from "podverse-shared"
import { ButtonCircle } from "~/components/Buttons/ButtonCircle"
import { generateItemTimeInfo } from "~/lib/utility/date"
import { playerLoadNowPlayingItem, playerTogglePlayOrLoadNowPlayingItem } from "~/services/player/player"
import { LiveStatusBadge } from "../LiveStatusBadge/LiveStatusBadge"

type Props = {
  episode: Episode
}

export const EmbedPlayerListItemEpisode = ({ episode }: Props) => {
  const { t } = useTranslation()
  const { liveItem } = episode
  const episodeTitle = episode.title || t('untitledEpisode')
  const { pubDate, timeInfo } = generateItemTimeInfo(t, episode)

  const _handleTogglePlayOrLoad = () => {
    const nowPlayingItem = convertToNowPlayingItem(episode)
    playerTogglePlayOrLoadNowPlayingItem(nowPlayingItem)
  }

  return (
    <div className='embed-player-list-item-episode'>
      <div className='embed-player-text-wrapper'>
        <div className='embed-player-list-item-episode-title'>
          {episodeTitle}
        </div>
        <div className='embed-player-list-item-time-wrapper'>
          <span className='embed-player-list-item-episode-pub-date'>
            {pubDate}
          </span>
          {!!timeInfo && (
            <>
              <span className='embed-player-list-item-time-spacer'> • </span>
              <span className='embed-player-list-item-time-info'>{timeInfo}</span>
            </>
          )}
        </div>
      </div>
      {
        !!liveItem && (
          <LiveStatusBadge liveItemStatus={liveItem.status} />
        )
      }
      <ButtonCircle
        ariaLabel={t('Play')}
        ariaPressed
        className='embed-player-play'
        faIcon={faPlay}
        onClick={_handleTogglePlayOrLoad}
        size={'small'}
      />
    </div>
  )
}
