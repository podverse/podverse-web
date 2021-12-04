import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import { Icon, PVImage } from '~/components'
import { getClipTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { playerPause, playerPlay } from '~/services/player/player'

type Props = {}

export const MobilePlayer = (props: Props) => {
  const [player] = useOmniAural('player')
  const { t } = useTranslation()
  const { currentNowPlayingItem, paused } = player

  if (!currentNowPlayingItem) return null

  const titleText =
    currentNowPlayingItem.clipId
      ? getClipTitle(t, currentNowPlayingItem.clipTitle, currentNowPlayingItem.episodeTitle)
      : (currentNowPlayingItem.episodeTitle || t('untitledEpisode'))
  const podcastTitleText = currentNowPlayingItem.podcastTitle || t('untitledPodcast')

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
            <div className='title'>
              {titleText}
            </div>
            <div className='podcast-title'>
              {podcastTitleText}
            </div>
          </div>
        </div>
        <div className='button' onClick={_handleTogglePlay} tabIndex={0}>
          <Icon faIcon={paused ? faPlay : faPause} />
        </div>
      </div>
      <div className='bottom'>
        progress
      </div>
    </div>
  )
}
