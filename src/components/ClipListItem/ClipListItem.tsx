import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonCircle, MediaItemControls, PVImage, PVLink } from '~/components'
import { generateItemTimeInfo } from '~/lib/utility/date'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { getClipTitle, getEpisodeTitle, getPodcastTitle } from '~/lib/utility/misc'
import { PV } from '~/resources'

type Props = {
  episode?: Episode
  handleRemove?: any
  imageUrl?: string
  isLoggedInUserMediaRef?: boolean
  mediaRef: MediaRef
  podcast?: Podcast
  showImage?: boolean
  showRemoveButton?: boolean
}

export const ClipListItem = ({
  episode,
  handleRemove,
  isLoggedInUserMediaRef,
  mediaRef,
  podcast,
  showImage,
  showRemoveButton
}: Props) => {
  const { t } = useTranslation()
  const { id, imageUrl } = mediaRef
  const title = getClipTitle(t, mediaRef.title, episode?.title)
  const podcastTitle = podcast ? getPodcastTitle(t, podcast) : ''
  const episodeTitle = episode ? `${getEpisodeTitle(t, episode)}` : ''
  const clipPageUrl = `${PV.RoutePaths.web.clip}/${id}`
  const [isRemoving, setIsRemoving] = useState<boolean>(false)

  const finalImageUrl = imageUrl
    ? imageUrl
    : episode?.imageUrl
    ? episode.imageUrl
    : podcast
    ? getPodcastShrunkImageUrl(podcast)
    : ''

  const { pubDate, timeInfo } = generateItemTimeInfo(t, episode, mediaRef)

  const linkAriaLabel = `${podcastTitle ? `${podcastTitle}, ` : ''} ${title}, ${
    episode ? `${episodeTitle}, ${pubDate}, ` : ''
  } ${timeInfo}`

  const _handleRemove = async () => {
    setIsRemoving(true)
    await handleRemove()
    setIsRemoving(false)
  }

  return (
    <>
      <li className='clip-list-item'>
        <div className='main-wrapper'>
          <PVLink ariaLabel={linkAriaLabel} className='content-wrapper' href={clipPageUrl}>
            {showImage && (
              <PVImage alt='' height={PV.Images.sizes.medium} src={finalImageUrl} width={PV.Images.sizes.medium} />
            )}
            <div className='text-wrapper'>
              {podcast && <div className='podcast-title'>{podcastTitle}</div>}
              <div className='title'>{title}</div>
              {episode && <div className='episode-title'>{episodeTitle}</div>}
            </div>
          </PVLink>
          <MediaItemControls
            buttonSize='medium'
            episode={episode}
            isLoggedInUserMediaRef={isLoggedInUserMediaRef}
            mediaRef={mediaRef}
            podcast={podcast}
            stretchMiddleContent
          />
        </div>
        {showRemoveButton && (
          <div className='side-wrapper'>
            <ButtonCircle
              ariaLabel={t('Remove')}
              className='remove'
              faIcon={faTimes}
              iconOnly
              isLoading={isRemoving}
              onClick={_handleRemove}
              size='medium'
            />
          </div>
        )}
      </li>
    </>
  )
}
