import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { getLightningKeysendValueItem } from 'podverse-shared'
import { ButtonCircle, PVImage, PVLink } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { readableClipTime } from '~/lib/utility/time'
import { PV } from '~/resources'
import { playerNextSpeed, playerPause, playerPlay } from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'
import { ProgressBar } from '../Player/controls/ProgressBar'
import { PlayerOptionButton } from '../Player/options/PlayerOptionButton'

type Props = {
  hideFullView?: boolean
}

export const EmbedPlayerHeader = ({ hideFullView }: Props) => {
  /* Initialize */

  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const {
    chapterFlagPositions,
    clipFlagPositions,
    currentNowPlayingItem,
    highlightedPositions,
    paused,
    playSpeed,
    showFullView
  } = player
  const playpause = classNames(paused ? 'play' : 'pause')

  const isClip = !!currentNowPlayingItem?.clipId
  const isChapter = !!currentNowPlayingItem?.clipIsOfficialChapter

  let topText = ''
  let topLink = ''
  let middleText = ''
  let middleLink = ''
  let bottomText = ''

  if (isChapter) {
    topText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    topLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${currentNowPlayingItem?.episodeId}`
    middleText = currentNowPlayingItem?.clipTitle || t('untitledChapter')
    middleLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clip}/${currentNowPlayingItem?.clipId}`
    const clipTimeInfo = readableClipTime(currentNowPlayingItem?.clipStartTime, currentNowPlayingItem?.clipEndTime)
    bottomText = clipTimeInfo
  } else if (isClip) {
    topText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    topLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${currentNowPlayingItem?.episodeId}`
    middleText = currentNowPlayingItem?.clipTitle || t('untitledClip')
    middleLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clip}/${currentNowPlayingItem?.clipId}`
    const clipTimeInfo = readableClipTime(currentNowPlayingItem?.clipStartTime, currentNowPlayingItem?.clipEndTime)
    bottomText = clipTimeInfo
  } else {
    topText = currentNowPlayingItem?.podcastTitle || t('untitledPodcast')
    topLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.podcast}/${currentNowPlayingItem?.podcastId}`
    middleText = currentNowPlayingItem?.episodeTitle || t('untitledEpisode')
    middleLink = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${currentNowPlayingItem?.episodeId}`
    bottomText = currentNowPlayingItem?.episodePubDate && readableDate(new Date(currentNowPlayingItem.episodePubDate))
  }

  const isLightningEnabled =
    getLightningKeysendValueItem(currentNowPlayingItem?.episodeValue) ||
    getLightningKeysendValueItem(currentNowPlayingItem?.podcastValue)

  /* Functions */

  const _handleTogglePlay = () => {
    paused ? playerPlay() : playerPause()
  }

  return (
    <div className='embed-player-header'>
      <div className='embed-player-header-image hide-below-mobile-max-width'>
        <PVImage
          alt=''
          height={PV.Images.sizes.embed}
          src={currentNowPlayingItem?.episodeImageUrl || currentNowPlayingItem?.podcastImageUrl}
          width={PV.Images.sizes.embed}
        />
      </div>
      <div className='embed-player-header-inner'>
        <div className='embed-player-header-top'>
          <div className='embed-player-header-image-mini hide-above-tablet-min-width'>
            <PVImage
              alt=''
              height={PV.Images.sizes.medium}
              src={currentNowPlayingItem?.episodeImageUrl || currentNowPlayingItem?.podcastImageUrl}
              width={PV.Images.sizes.medium}
            />
          </div>
          <div className='embed-player-header-text-wrapper'>
            <div className='embed-player-header-top-text'>
              <PVLink href={topLink} target='_blank'>
                {topText}
              </PVLink>
            </div>
            <div className='embed-player-header-middle-text'>
              <PVLink href={middleLink} target='_blank'>
                {middleText}
              </PVLink>
            </div>
            <div className='embed-player-header-bottom-text'>{bottomText}</div>
          </div>
          {!hideFullView && (
            <div className='embed-player-header-top-side'>
              {
                isLightningEnabled && (
                  <PlayerOptionButton
                    ariaLabel={showFullView ? t('Hide full screen player') : t('Show full screen player')}
                    ariaPressed
                    className='player-option-button-value-enabled'
                    linkUrl={middleLink}
                    size='small'
                    type='value-enabled'
                  />
                )
              }
              <PlayerOptionButton
                ariaLabel={showFullView ? t('Hide full screen player') : t('Show full screen player')}
                ariaPressed
                onClick={showFullView ? OmniAural.playerFullViewHide : OmniAural.playerFullViewShow}
                size='small'
                type={showFullView ? 'fullscreen-hide' : 'fullscreen-show'}
              />
            </div>
          )}
        </div>
        <div className='embed-player-header-bottom'>
          <ProgressBar
            chapterFlagPositions={chapterFlagPositions}
            clipFlagPositions={clipFlagPositions}
            highlightedPositions={highlightedPositions}
          />
          <PlayerOptionButton
            ariaDescription={t('Playback speed')}
            className='playback-speed'
            onClick={() => playerNextSpeed(null, null)}
            size='small'
            type='speed'
          >
            {playSpeed}x
          </PlayerOptionButton>
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
