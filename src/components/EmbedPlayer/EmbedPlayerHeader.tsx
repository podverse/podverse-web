import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { ButtonCircle, PVImage } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { readableClipTime } from '~/lib/utility/time'
import { PV } from '~/resources'
import { playerPause, playerPlay } from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'
import { ProgressBar } from '../Player/controls/ProgressBar'

export const EmbedPlayerHeader = () => {
  /* Initialize */

  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { chapterFlagPositions, clipFlagPositions, currentNowPlayingItem, highlightedPositions, paused } = player
  const playpause = classNames(paused ? 'play' : 'pause')

  const isClip = !!currentNowPlayingItem?.clipId
  const isChapter = !!currentNowPlayingItem?.clipIsOfficialChapter

  let topText = ''
  let middleText = ''
  let bottomText = ''

  if (isChapter) {
    topText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    middleText = currentNowPlayingItem?.clipTitle || t('untitledChapter')
    const clipTimeInfo = readableClipTime(currentNowPlayingItem?.clipStartTime, currentNowPlayingItem?.clipEndTime)
    bottomText = clipTimeInfo
  } else if (isClip) {
    topText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    middleText = currentNowPlayingItem?.clipTitle || t('untitledClip')
    const clipTimeInfo = readableClipTime(currentNowPlayingItem?.clipStartTime, currentNowPlayingItem?.clipEndTime)
    bottomText = clipTimeInfo
  } else {
    topText = currentNowPlayingItem?.podcastTitle || t('untitledPodcast')
    middleText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    bottomText = currentNowPlayingItem?.episodePubDate && readableDate(new Date(currentNowPlayingItem.episodePubDate))
  }

  /* Functions */

  const _handleTogglePlay = () => {
    paused ? playerPlay() : playerPause()
  }

  return (
    <div className='embed-player-header'>
      <div className='embed-player-header-image'>
        <PVImage
          alt=''
          height={PV.Images.sizes.embed}
          src={currentNowPlayingItem?.episodeImageUrl || currentNowPlayingItem?.podcastImageUrl}
          width={PV.Images.sizes.embed}
        />
      </div>
      <div className='embed-player-header-inner'>
        <div className='embed-player-header-top'>
          <div className='embed-player-header-top-text'>
            {topText}
          </div>
          <div className='embed-player-header-middle-text'>
            {middleText}
          </div>
          <div className='embed-player-header-bottom-text'>
            {bottomText}
          </div>
        </div>
        <div className='embed-player-header-bottom'>
          <ProgressBar
            chapterFlagPositions={chapterFlagPositions}
            clipFlagPositions={clipFlagPositions}
            highlightedPositions={highlightedPositions}
          />
          <ButtonCircle
            ariaLabel={paused ? t('Play') : t('Pause')}
            ariaPressed
            className={playpause}
            faIcon={paused ? faPlay : faPause}
            onClick={_handleTogglePlay}
            size={'medium'}
          />
        </div>
      </div>
    </div>
  )
}
