import { faTimes, faArrowsAltV } from '@fortawesome/free-solid-svg-icons'
import { Episode, getLightningKeysendValueItem, LiveItem, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import striptags from 'striptags'
import { ButtonCircle, MediaItemControls, PVImage, PVLink } from '~/components'
import { generateAriaItemTimeInfo } from '~/lib/utility/ariaHelpers'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { webAddLightningBoltToString } from '~/lib/utility/valueTag'
import { PV } from '~/resources'

type Props = {
  episode?: Episode
  handleRemove?: any
  imageUrl?: string
  isLiveItemNotLive?: boolean
  liveItem?: LiveItem
  podcast?: Podcast
  serverCookies?: any
  showPodcastInfo?: boolean
  showRemoveButton?: boolean
  showMoveButton?: boolean
  dragHandleProps?: any // TODO: add proper type
}

export const EpisodeListItem = ({
  episode,
  handleRemove,
  isLiveItemNotLive,
  liveItem,
  podcast,
  serverCookies,
  showPodcastInfo,
  showRemoveButton,
  showMoveButton,
  dragHandleProps
}: Props) => {
  const { t } = useTranslation()
  const ep = liveItem?.episode || episode
  const { description, id, imageUrl, subtitle } = ep
  const title = ep.title || t('untitledEpisode')
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${id}`
  const [isRemoving, setIsRemoving] = useState<boolean>(false)
  let summaryText = subtitle && subtitle !== title ? subtitle : description
  summaryText = striptags(summaryText)

  const finalImageUrl = imageUrl ? imageUrl : podcast ? getPodcastShrunkImageUrl(podcast) : ''
  const clip = null
  const linkAriaTimeInfo = generateAriaItemTimeInfo(t, ep, clip)
  const linkAriaLabel = `${showPodcastInfo ? `${podcast.title}, ` : ''} ${title}, ${linkAriaTimeInfo}, ${summaryText}`

  const isLightningEnabled =
    getLightningKeysendValueItem(episode?.value) ||
    getLightningKeysendValueItem(podcast?.value) ||
    podcast?.hasPodcastIndexValueTag
  const finalPodcastTitle = isLightningEnabled
    ? webAddLightningBoltToString(serverCookies, podcast.title)
    : podcast.title

  const _handleRemove = async () => {
    setIsRemoving(true)
    await handleRemove()
    setIsRemoving(false)
  }

  return (
    <>
      <li className='episode-list-item'>
        {showMoveButton && (
          <div className='side-wrapper'>
            <ButtonCircle
              ariaLabel={t('Move')}
              className='move'
              faIcon={faArrowsAltV}
              iconOnly
              size='medium'
              {...dragHandleProps}
            />
          </div>
        )}
        <div className='main-wrapper'>
          <PVLink ariaLabel={linkAriaLabel} className='content-wrapper' href={episodePageUrl}>
            {showPodcastInfo && (
              <PVImage alt='' height={PV.Images.sizes.medium} src={finalImageUrl} width={PV.Images.sizes.medium} />
            )}
            <div className='text-wrapper'>
              {showPodcastInfo && <div className='podcast-title'>{finalPodcastTitle}</div>}
              <div className='title'>{title}</div>
              <div
                className='description'
                dangerouslySetInnerHTML={{
                  __html: summaryText
                }}
              />
            </div>
          </PVLink>
          <MediaItemControls
            buttonSize='medium'
            episode={episode}
            isLiveItemNotLive={isLiveItemNotLive}
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
