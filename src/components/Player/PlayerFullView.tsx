import classNames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { ButtonClose, PVImage, PVLink } from '~/components'
import { getClipTitle } from '~/lib/utility/misc'
import { readableClipTime } from '~/lib/utility/time'
import { PV } from '~/resources'
import { checkIfVideoFileType } from '~/services/player/playerVideo'
import { PlayerProgressButtons } from './controls/PlayerProgressButtons'
import { ProgressBar } from './controls/ProgressBar'
import { PlayerAPIVideo } from './PlayerAPI/PlayerAPIVideo'
import { PlayerItemButtons } from './PlayerItemOptions'

type Props = {
  nowPlayingItem: NowPlayingItem
}

export const PlayerFullView = ({ nowPlayingItem }: Props) => {
  const { t } = useTranslation()
  const [player] = useOmniAural('player')
  const { chapterFlagPositions, clipFlagPositions, highlightedPositions, showFullView } = player
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${nowPlayingItem.podcastId}`
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${nowPlayingItem.episodeId}`
  const imageWrapperClass = classNames('image-wrapper', nowPlayingItem.clipId ? 'has-clip-info' : '')
  const isVideo = checkIfVideoFileType(nowPlayingItem)

  const _onRequestClose = () => {
    OmniAural.playerFullViewHide()
  }

  const clipTitle = getClipTitle(t, nowPlayingItem.clipTitle, nowPlayingItem.episodeTitle)

  const clipTimeInfo = readableClipTime(nowPlayingItem.clipStartTime, nowPlayingItem.clipEndTime)

  const viewClass = classNames('player-full-view', showFullView ? 'is-showing' : '')

  return (
    <div className={viewClass}>
      <div className={imageWrapperClass}>
        {isVideo && <PlayerAPIVideo />}
        {showFullView && !isVideo && (
          <PVImage
            alt={t('Podcast artwork')}
            height={PV.Images.sizes.fullViewAudio}
            src={nowPlayingItem.episodeImageUrl || nowPlayingItem.podcastImageUrl}
            width={PV.Images.sizes.fullViewAudio}
          />
        )}
        {showFullView && nowPlayingItem.clipId && (
          <div className='clip-info-wrapper'>
            <div className='clip-title'>{clipTitle}</div>
            <div className='clip-time'>{clipTimeInfo}</div>
          </div>
        )}
      </div>
      {showFullView && (
        <>
          <ButtonClose onClick={_onRequestClose} />
          <div className='title-wrapper'>
            <h1>
              <PVLink href={episodePageUrl} onClick={_onRequestClose}>
                {nowPlayingItem.episodeTitle || t('untitledEpisode')}
              </PVLink>
            </h1>
            <div className='subtitle'>
              <PVLink href={podcastPageUrl} onClick={_onRequestClose}>
                {nowPlayingItem.podcastTitle || t('untitledPodcast')}
              </PVLink>
            </div>
          </div>
          <div className='player-buttons-wrapper'>
            <ProgressBar
              chapterFlagPositions={chapterFlagPositions}
              clipFlagPositions={clipFlagPositions}
              highlightedPositions={highlightedPositions}
            />
            <div className='player-progress-container'>
              <div className='player-item-info-container' />
              <PlayerProgressButtons />
              <PlayerItemButtons />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
