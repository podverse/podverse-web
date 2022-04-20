import classnames from 'classnames'
import OmniAural from 'omniaural'
import { PVImage } from '~/components'
import type { NowPlayingItem } from 'podverse-shared'
import { PV } from '~/resources'
import { useTranslation } from 'react-i18next'
import { getClipTitle } from '~/lib/utility/misc'

type Props = {
  nowPlayingItem: NowPlayingItem
}

export const PlayerItemInfo = ({ nowPlayingItem }: Props) => {
  const { t } = useTranslation()
  const container = classnames('player-item-info-container')
  const contentsContainer = classnames('player-item-contents')
  const textContainer = classnames('player-item-info-text-container')
  const title = classnames('item-info-title')
  const subtitle = classnames('item-info-subtitle')
  const titleText = nowPlayingItem.clipId
    ? getClipTitle(t, nowPlayingItem.clipTitle, nowPlayingItem.episodeTitle)
    : nowPlayingItem.episodeTitle || t('untitledEpisode')
  const podcastTitleText = nowPlayingItem.podcastTitle || t('untitledPodcast')

  return (
    <div className={container}>
      <button
        aria-description={t('Display the full screen media player')}
        className={contentsContainer}
        onClick={OmniAural.playerFullViewShow}
        tabIndex={0}
      >
        <PVImage
          alt=''
          height={PV.Images.sizes.medium}
          width={PV.Images.sizes.medium}
          src={nowPlayingItem.episodeImageUrl || nowPlayingItem.podcastImageUrl}
        />
        <div className={textContainer}>
          <div className={title}>{titleText}</div>
          <div className={subtitle}>{podcastTitleText}</div>
        </div>
      </button>
    </div>
  )
}
