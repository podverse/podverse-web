import { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, TruncatedText } from '~/components'

type Props = {
  episode: Episode
  includeMediaItemControls?: boolean
}

export const EpisodeInfo = ({ episode, includeMediaItemControls = false }: Props) => {
  const { t } = useTranslation()
  const description = episode.description || t('No episode notes available')

  return (
    <div className='episode-info'>
      <h2>{t('Episode Notes')}</h2>
      <TruncatedText
        dangerouslySetInnerHtml
        lines={3}
        text={description} />
      {
        includeMediaItemControls && (
          <MediaItemControls
            buttonSize='large'
            episode={episode} />
        )
      }
      <hr />
    </div>
  )
}
