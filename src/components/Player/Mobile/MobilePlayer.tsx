import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import { Icon, PVImage } from '~/components'
import { Slider } from '~/components/Slider/Slider'
import { getClipTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { playerPause, playerPlay, playerSeekTo } from '~/services/player/player'

type Props = unknown

export const MobilePlayer = (props: Props) => {
  const [player] = useOmniAural('player')
  const { t } = useTranslation()
  const {
    chapterFlagPositions,
    clipFlagPositions,
    currentNowPlayingItem,
    duration,
    highlightedPositions,
    paused,
    playbackPosition
  } = player

  if (!currentNowPlayingItem) return null

  const titleText = currentNowPlayingItem.clipId
    ? getClipTitle(t, currentNowPlayingItem.clipTitle, currentNowPlayingItem.episodeTitle)
    : currentNowPlayingItem.episodeTitle || t('untitledEpisode')
  const podcastTitleText = currentNowPlayingItem.podcastTitle || t('untitledPodcast')

  const flagPositions = clipFlagPositions.length > 0 ? clipFlagPositions : chapterFlagPositions

  const _handleTogglePlay = () => {
    paused ? playerPlay() : playerPause()
  }

  return (
    <div className='mobile-player'>
      <div className='top'>
        <div className='clickable-area' onClick={OmniAural.playerFullViewShow} tabIndex={0}>
          <PVImage
            alt={t('Podcast artwork')}
            height={PV.Images.sizes.medium}
            width={PV.Images.sizes.medium}
            src={currentNowPlayingItem.episodeImageUrl || currentNowPlayingItem.podcastImageUrl}
          />
          <div className='text-wrapper'>
            <div className='title'>{titleText}</div>
            <div className='podcast-title'>{podcastTitleText}</div>
          </div>
        </div>
        <div className='button' onClick={_handleTogglePlay} tabIndex={0}>
          <Icon faIcon={paused ? faPlay : faPause} />
        </div>
      </div>
      <div className='bottom'>
        <Slider
          className='mobile-player-bar'
          currentValue={playbackPosition}
          endVal={duration}
          flagPositions={flagPositions}
          highlightedPositions={highlightedPositions}
          onValueChange={playerSeekTo}
          showFlags={(!clipFlagPositions || clipFlagPositions.length === 0) && chapterFlagPositions?.length > 1}
          startVal={0}
        />
      </div>
    </div>
  )
}
