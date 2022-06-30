import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "next-i18next"
import { convertToNowPlayingItem, Episode } from "podverse-shared"
import { ButtonCircle } from "~/components/Buttons/ButtonCircle"
import { generateItemTimeInfo } from "~/lib/utility/date"
import { audioLoadNowPlayingItem } from "~/services/player/playerAudio"

type Props = {
  episode: Episode
}

export const EmbedPlayerListItemEpisode = ({ episode }: Props) => {
  const { t } = useTranslation()
  const episodeTitle = episode.title || t('untitledEpisode')
  const { pubDate, timeInfo } = generateItemTimeInfo(t, episode)

  const _handlePlay = () => {
    const nowPlayingItem = convertToNowPlayingItem(episode)
    const previousNowPlayingItem = null
    const shouldPlay = true
    audioLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
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
      <ButtonCircle
        ariaLabel={t('Play')}
        ariaPressed
        className='embed-player-play'
        faIcon={faPlay}
        onClick={_handlePlay}
        size={'small'}
      />
    </div>
  )
}
