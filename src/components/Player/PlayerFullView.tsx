import classNames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { ButtonClose, PVImage, PVLink } from '~/components'
import { getClipTitle } from '~/lib/utility/misc'
import { readableClipTime } from '~/lib/utility/time'
import { PV } from '~/resources'
import { PlayerProgressButtons } from './controls/PlayerProgressButtons'
import { ProgressBar } from './controls/ProgressBar'
import { PlayerItemButtons } from './PlayerItemOptions'

type Props = {
  nowPlayingItem: NowPlayingItem
}

export const PlayerFullView = ({ nowPlayingItem }: Props) => {
  const { t } = useTranslation()
  const [player] = useOmniAural('player')
  const { chapterFlagPositions, clipFlagPositions, highlightedPositions } = player
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${nowPlayingItem.podcastId}`
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${nowPlayingItem.episodeId}`
  const imageWrapperClass = classNames('image-wrapper', nowPlayingItem.clipId ? 'has-clip-info' : '')

  const _onRequestClose = () => {
    OmniAural.playerFullViewHide()
  }

  /* TODO: update getClipTitle to take clipTitle and episodeTitle as parameters
           instead of mediaRef and episodeTitle. */
  const clipTitle = getClipTitle(t, { title: nowPlayingItem.clipTitle } as any, nowPlayingItem.episodeTitle)

  let clipTimeInfo = readableClipTime(nowPlayingItem.clipStartTime, nowPlayingItem.clipEndTime)

  return (
    <div className='player-full-view'>
      <ButtonClose onClick={_onRequestClose} />
      <div className={imageWrapperClass}>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.fullViewAudio}
          src={nowPlayingItem.episodeImageUrl || nowPlayingItem.podcastImageUrl}
          width={PV.Images.sizes.fullViewAudio}
        />
        {nowPlayingItem.clipId && (
          <div className='clip-info-wrapper'>
            <div className='clip-title'>{clipTitle}</div>
            <div className='clip-time'>{clipTimeInfo}</div>
          </div>
        )}
      </div>
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
    </div>
  )
}
