import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonCircle, MediaItemControls, PVImage, PVLink } from '~/components'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { getClipTitle, getEpisodeTitle, getPodcastTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'

type Props = {
  episode?: Episode
  handleRemove?: any
  imageUrl?: string
  mediaRef: MediaRef
  podcast: Podcast
  showImage?: boolean
  showRemoveButton?: boolean
}

export const ClipListItem = ({ episode, handleRemove, mediaRef, podcast,
  showImage, showRemoveButton }: Props) => {
  const { t } = useTranslation()
  const { id, imageUrl } = mediaRef
  const title = getClipTitle(t, mediaRef, episode?.title)
  const episodePodcastTitles = episode ? `${getEpisodeTitle(t, episode)} – ${getPodcastTitle(t, podcast)}` : ''
  const clipPageUrl = `${PV.RoutePaths.web.clip}/${id}`
  const [isRemoving, setIsRemoving] = useState<boolean>(false)

  const finalImageUrl = imageUrl
    ? imageUrl
    : episode?.imageUrl
      ? episode.imageUrl
      : podcast
        ? getPodcastShrunkImageUrl(podcast)
        : ''

  const _handleRemove = async () => {
    setIsRemoving(true)
    await handleRemove()
    setIsRemoving(false)
  }

  return (
    <>
      <li className='clip-list-item'>
        <div className='main-wrapper'>
          <PVLink
            className='content-wrapper'
            href={clipPageUrl}>
            {
              showImage && (
                <PVImage
                  alt={t('Podcast artwork')}
                  height={PV.Images.sizes.medium}
                  src={finalImageUrl}
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
          </PVLink>
          <MediaItemControls
            buttonSize='medium'
            mediaRef={mediaRef}
            stretchMiddleContent />
        </div>
        {
          showRemoveButton && (
            <div className='side-wrapper'>
              <ButtonCircle
                className='remove'
                faIcon={faTrashAlt}
                iconOnly
                isLoading={isRemoving}
                onClick={_handleRemove}
                size='medium' />
            </div>
          )
        }
      </li>
      <hr className='clip-list-item-hr' />
    </>
  )
}
