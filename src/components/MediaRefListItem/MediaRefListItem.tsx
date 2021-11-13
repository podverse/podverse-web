import Link from 'next/link'
import { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, PVImage } from '~/components'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { getMediaRefTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'

type Props = {
  imageUrl?: string
  mediaRef: MediaRef
  podcast: Podcast
  showImage?: boolean
}

export const MediaRefListItem = ({ mediaRef, podcast, showImage }: Props) => {
  const { t } = useTranslation()
  const { episode, id, imageUrl } = mediaRef
  const title = getMediaRefTitle(t, mediaRef, episode.title)
  const episodePodcastTitles = `${episode.title} – ${podcast.title}`
  const mediaRefPageUrl = `${PV.RoutePaths.web.clip}/${id}`

  return (
    <>
      <li className='mediaref-list-item'>
        <Link href={mediaRefPageUrl}>
          <div className='content-wrapper' tabIndex={0}>
            {
              showImage && (
                <PVImage
                  alt={t('Podcast artwork')}
                  height={PV.Images.sizes.medium}
                  src={imageUrl}
                  width={PV.Images.sizes.medium} />
              )
            }
            <div className='text-wrapper'>
              <h3>{title}</h3>
              <div className='episode-podcast-titles'>
                {episodePodcastTitles}
              </div>
            </div>
          </div>
        </Link>
        <MediaItemControls
          buttonSize='medium'
          mediaRef={mediaRef} />
      </li>
      <hr className='mediaref-list-item-hr' />
    </>
  )
}
