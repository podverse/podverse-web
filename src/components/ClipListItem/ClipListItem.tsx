import { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { MediaItemControls, PVImage, PVLink } from '~/components'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { getClipTitle, getEpisodeTitle, getPodcastTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'

type Props = {
  episode?: Episode
  imageUrl?: string
  mediaRef: MediaRef
  podcast: Podcast
  showImage?: boolean
}

export const ClipListItem = ({ episode, mediaRef, podcast, showImage }: Props) => {
  const { t } = useTranslation()
  const { id, imageUrl } = mediaRef
  const title = getClipTitle(t, mediaRef, episode?.title)
  const episodePodcastTitles = episode ? `${getEpisodeTitle(t, episode)} – ${getPodcastTitle(t, podcast)}` : ''
  const clipPageUrl = `${PV.RoutePaths.web.clip}/${id}`

  return (
    <>
      <li className='mediaref-list-item'>
        <PVLink href={clipPageUrl}>
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
              {
                episode && (
                  <div className='episode-podcast-titles'>
                    {episodePodcastTitles}
                  </div>
                )
              }
            </div>
          </div>
        </PVLink>
        <MediaItemControls
          buttonSize='medium'
          mediaRef={mediaRef}
          stretchMiddleContent />
      </li>
      <hr className='mediaref-list-item-hr' />
    </>
  )
}
