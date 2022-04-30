import type { Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { PVImage, PVLink } from '~/components'
import { readableDate } from '~/lib/utility/date'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { ButtonRectangle } from '../Buttons/ButtonRectangle'

type Props = {
  podcast: Podcast
}

export const PodcastListItem = ({ podcast }: Props) => {
  const { t } = useTranslation()
  const { id, lastEpisodePubDate, latestLiveItemStatus, title } = podcast
  const podcastImageUrl = getPodcastShrunkImageUrl(podcast)
  const pubDateText = `${t('Latest Episode')}: ${readableDate(lastEpisodePubDate)}`
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${id}`
  const ariaLabel = `${title}, ${pubDateText}`

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
            <div className='last-episode-pub-date'>{pubDateText}</div>
            <div className='title'>{title}</div>
          </div>
          <div className='live-status-wrapper'>
            {latestLiveItemStatus === 'live' && (
              <ButtonRectangle
                disableHover
                isDanger
                label={t('Live Now')}
                type='status-badge' />
            )}
          </div>
        </PVLink>
      </li>
    </>
  )
}
