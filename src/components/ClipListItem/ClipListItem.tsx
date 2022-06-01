import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Episode, getLightningKeysendValueItem, MediaRef, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonCircle, MediaItemControls, PVImage, PVLink } from '~/components'
import { generateItemTimeInfo } from '~/lib/utility/date'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { getClipTitle, getEpisodeTitle, getPodcastTitle } from '~/lib/utility/misc'
import { webAddLightningBoltToString } from '~/lib/utility/valueTag'
import { PV } from '~/resources'

type Props = {
  episode?: Episode
  handleRemove?: any
  hidePubDate?: boolean
  isChapter?: boolean
  isLoggedInUserMediaRef?: boolean
  mediaRef: MediaRef
  podcast?: Podcast
  serverCookies?: any
  showImage?: boolean
  showRemoveButton?: boolean
}

export const ClipListItem = ({
  episode,
  handleRemove,
  isChapter,
  isLoggedInUserMediaRef,
  mediaRef,
  podcast,
  serverCookies,
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

  const { pubDate, timeInfo } = generateItemTimeInfo(t, episode, mediaRef, isChapter)

  const linkAriaLabel = `${podcastTitle ? `${podcastTitle}, ` : ''} ${title}, ${
    episode ? `${episodeTitle}, ${pubDate}, ` : ''
  } ${timeInfo}`

  const isLightningEnabled =
    getLightningKeysendValueItem(episode?.value) ||
    getLightningKeysendValueItem(podcast?.value) ||
    podcast?.hasPodcastIndexValueTag
  const finalPodcastTitle = isLightningEnabled ? webAddLightningBoltToString(serverCookies, podcastTitle) : podcastTitle

  const _handleRemove = async () => {
    setIsRemoving(true)
    await handleRemove()
    setIsRemoving(false)
  }

  const mediaItemControls = (
    <MediaItemControls
      buttonSize='medium'
      episode={episode}
      hidePubDate={!episode}
      isChapter={isChapter}
      isLoggedInUserMediaRef={isLoggedInUserMediaRef}
      mediaRef={mediaRef}
      podcast={podcast}
      stretchMiddleContent
    />
  )

  let itemMainSection = (
    <>
      <PVLink ariaLabel={linkAriaLabel} className='content-wrapper' href={clipPageUrl}>
        {!isChapter && showImage && finalImageUrl && (
          <PVImage alt='' height={PV.Images.sizes.medium} src={finalImageUrl} width={PV.Images.sizes.medium} />
        )}
        <div className='text-wrapper'>
          {podcast && <div className='podcast-title'>{finalPodcastTitle}</div>}
          <div className='title'>{title}</div>
          {episode && <div className='episode-title'>{episodeTitle}</div>}
        </div>
      </PVLink>
      {mediaItemControls}
    </>
  )

  if (isChapter) {
    itemMainSection = (
      <div className='content-wrapper chapter-content-wrapper'>
        {!isChapter && showImage && finalImageUrl && (
          <PVLink tabIndex={-1} href={clipPageUrl}>
            <PVImage alt='' height={PV.Images.sizes.medium} src={finalImageUrl} width={PV.Images.sizes.medium} />
          </PVLink>
        )}
        <div className='text-wrapper'>
          {podcast && <div className='podcast-title'>{podcastTitle}</div>}
          <PVLink ariaLabel={linkAriaLabel} href={clipPageUrl}>
            <div className='title'>{title}</div>
          </PVLink>
          {episode && <div className='episode-title'>{episodeTitle}</div>}
          {mediaItemControls}
        </div>
      </div>
    )
  }

  return (
    <>
      <li className='clip-list-item'>
        <div className={isChapter ? 'main-wrapper chapter-main-wrapper' : 'main-wrapper'}>
          {isChapter && showImage && finalImageUrl && (
            <PVImage alt='' height={PV.Images.sizes.medium} src={finalImageUrl} width={PV.Images.sizes.medium} />
          )}
          {itemMainSection}
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
