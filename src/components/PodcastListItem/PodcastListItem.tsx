import Link from 'next/link'
import type { Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { readableDate } from '~/lib/utility/date'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { PVImage } from '..'

type Props = {
  podcast: Podcast
}

export const PodcastListItem = ({ podcast }: Props) => {
  const { t } = useTranslation()
  const { id, lastEpisodePubDate, title } = podcast
  const podcastImageUrl = getPodcastShrunkImageUrl(podcast)
  const pubDateText = `${t('Latest Episode')}: ${readableDate(lastEpisodePubDate)}`
  const podcastPageUrl = `${PV.RoutePaths.web.podcast}/${id}`

  return (
    <>
      <li>
        <Link href={podcastPageUrl}>
          <a className='podcast-list-item'>
            <PVImage
              alt={t('Podcast artwork')}
              height={PV.Images.sizes.medium}
              src={podcastImageUrl}
              width={PV.Images.sizes.medium} />
            <div className='text-wrapper'>
              <div className='last-episode-pub-date'>{pubDateText}</div>
              <div className='title'>{title}</div>
            </div>
          </a>
        </Link>
      </li>
      <hr />
    </>
  )
}
