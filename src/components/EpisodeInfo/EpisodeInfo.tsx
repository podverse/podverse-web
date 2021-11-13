import { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { TruncatedText } from '~/components'

type Props = {
  episode: Episode
}

export const EpisodeInfo = ({ episode }: Props) => {
  const { t } = useTranslation()
  const description = episode.description || t('No show notes available')

  return (
    <div className='episode-info'>
      <h2>{t('Show Notes')}</h2>
      <TruncatedText
        dangerouslySetInnerHtml
        lines={3}
        text={description} />
    </div>
  )
}
