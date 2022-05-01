import classNames from 'classnames'
import { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, TruncatedText } from '~/components'

type Props = {
  episode: Episode
  fundingLinks?: any[]
  includeMediaItemControls?: boolean
  noMarginBottom?: boolean
}

export const EpisodeInfo = ({ episode, includeMediaItemControls = false, noMarginBottom }: Props) => {
  const { t } = useTranslation()
  const { liveItem } = episode
  const isLiveItem = !!liveItem
  const summaryText = episode.description || episode.subtitle || t('No episode notes available')
  const episodeInfoClassName = classNames('episode-info', noMarginBottom ? 'no-margin-bottom' : '')
  const hrClassName = classNames(isLiveItem ? 'display-none' : '')

  return (
    <div className={episodeInfoClassName}>
      <h2 tabIndex={0}>{t('Episode Notes')}</h2>
      <TruncatedText dangerouslySetInnerHtml lines={3} text={summaryText} />
      {includeMediaItemControls && <MediaItemControls buttonSize='large' episode={episode} />}
      <hr className={hrClassName} />
    </div>
  )
}
