import classNames from 'classnames'
import { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, TruncatedText } from '~/components'

type Props = {
  episode: Episode
  includeMediaItemControls?: boolean
  noMarginBottom?: boolean
  noMarginTop?: boolean
}

export const EpisodeInfo = ({ episode, includeMediaItemControls = false, noMarginBottom, noMarginTop }: Props) => {
  const { t } = useTranslation()
  const description = episode.description || t('No episode notes available')
  const episodeInfoClassName = classNames(
    'episode-info',
    noMarginTop ? 'no-margin-top' : '',
    noMarginBottom ? 'no-margin-bottom' : ''
  )

  return (
    <div className={episodeInfoClassName}>
      <h2>{t('Episode Notes')}</h2>
      <TruncatedText dangerouslySetInnerHtml lines={3} text={description} />
      {includeMediaItemControls && <MediaItemControls buttonSize='large' episode={episode} />}
      <hr />
    </div>
  )
}
