import OmniAural from 'omniaural'
import type { NowPlayingItem } from 'podverse-shared'
import { useTranslation } from "react-i18next"
import { ButtonClose, PVImage, PVLink } from "~/components"
import { PV } from '~/resources'
import { PlayerProgressButtons } from './controls/PlayerProgressButtons'
import { ProgressBar } from './controls/ProgressBar'
import { PlayerItemButtons } from './PlayerItemOptions'

type Props = {
  nowPlayingItem: NowPlayingItem
}

export const PlayerFullView = ({ nowPlayingItem }: Props) => {
  const { t } = useTranslation()
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${nowPlayingItem.podcastId}`
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${nowPlayingItem.episodeId}`

  const _onRequestClose = () => {
    OmniAural.playerFullViewHide()
  }

  return (
    <div
      className='player-full-view'>
      <ButtonClose onClick={_onRequestClose} />
      <div className='image-wrapper'>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.fullViewAudio}
          src={nowPlayingItem.episodeImageUrl || nowPlayingItem.podcastImageUrl}
          width={PV.Images.sizes.fullViewAudio}
        />
      </div>
      <div className='title-wrapper'>
        <h1>
          <PVLink href={episodePageUrl}>
            {nowPlayingItem.episodeTitle || t('untitledEpisode')}
          </PVLink>
        </h1>
        <div className='subtitle'>
          <PVLink href={podcastPageUrl}>
            {nowPlayingItem.podcastTitle || t('untitledPodcast')}
          </PVLink>
        </div>
      </div>
      <div className='player-buttons-wrapper'>
        <ProgressBar />
        <div className='player-progress-container'>
          <div className='player-item-info-container'/>
          <PlayerProgressButtons />
          <PlayerItemButtons />
        </div>
      </div>
    </div>
  )
}
