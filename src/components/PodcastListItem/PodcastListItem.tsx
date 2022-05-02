import type { Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { PVImage, PVLink } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { ariaLiveItemStatusLabel } from '~/services/liveItem'
import { ButtonRectangle } from '../Buttons/ButtonRectangle'
import { LiveStatusBadge } from '../LiveStatusBadge/LiveStatusBadge'

type Props = {
  podcast: Podcast
}

export const PodcastListItem = ({ podcast }: Props) => {
  const { t } = useTranslation()
  const { id, lastEpisodePubDate, latestLiveItemStatus, title } = podcast
  const podcastImageUrl = getPodcastShrunkImageUrl(podcast)
  const pubDateText = `${t('Latest Episode')}: ${readableDate(lastEpisodePubDate)}`
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${id}`
  const liveItemStatusAriaLabel = ariaLiveItemStatusLabel(latestLiveItemStatus, t)
  const ariaLabel = `${title}, ${pubDateText} ${liveItemStatusAriaLabel ? `, ${liveItemStatusAriaLabel}` : ''}`

  return (
    <>
      <li className='podcast-list-item'>
        <PVLink ariaLabel={ariaLabel} href={podcastPageUrl}>
          <PVImage
            alt={t('Podcast artwork')}
            height={PV.Images.sizes.medium}
            src={podcastImageUrl}
            width={PV.Images.sizes.medium}
          />
          <div className='text-wrapper'>
            {latestLiveItemStatus === 'live' && (
              <LiveStatusBadge hideAboveMobileWidth liveItemStatus={latestLiveItemStatus} />
            )}
            <div className='last-episode-pub-date'>{pubDateText}</div>
            <div className='title'>{title}</div>
          </div>
          <div className='live-status-wrapper'>
            {latestLiveItemStatus === 'live' && (
              <LiveStatusBadge hideBelowMobileWidth liveItemStatus={latestLiveItemStatus} />
            )}
          </div>
        </PVLink>
      </li>
    </>
  )
}
