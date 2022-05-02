import { useTranslation } from 'next-i18next'
import { Episode } from 'podverse-shared'
import { PVLink } from '~/components'
import { generateItemTimeInfo } from '~/lib/utility/date'
import { PV } from '~/resources'

type Props = {
  episode: Episode
}

export const LiveScheduleItem = ({ episode }: Props) => {
  const { t } = useTranslation()
  const { id, liveItem, title } = episode
  const { status } = liveItem
  const { endDate, pubDate } = generateItemTimeInfo(t, episode)
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${id}`

  return (
    <div className='live-schedule-item'>
      <div className='title'>{title}</div>
      {status === 'live' && (
        <PVLink className='live-now' href={episodePageUrl}>
          {' '}
          ● {t('Live')}
        </PVLink>
      )}
      {status === 'pending' && (
        <div className='time'>
          {t('When')}: {pubDate}
        </div>
      )}
      {status === 'ended' && (
        <div className='time'>
          {t('Ended')} {endDate}
        </div>
      )}
    </div>
  )
}
