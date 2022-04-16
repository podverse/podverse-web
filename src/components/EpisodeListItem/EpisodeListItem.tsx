import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Episode, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import striptags from 'striptags'
import { ButtonCircle, MediaItemControls, PVImage, PVLink } from '~/components'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'

type Props = {
  episode: Episode
  handleRemove?: any
  imageUrl?: string
  podcast?: Podcast
  showPodcastInfo?: boolean
  showRemoveButton?: boolean
}

export const EpisodeListItem = ({ episode, handleRemove, podcast, showPodcastInfo, showRemoveButton }: Props) => {
  const { t } = useTranslation()
  const { description, id, imageUrl, subtitle } = episode
  const title = episode.title || t('untitledEpisode')
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${id}`
  const [isRemoving, setIsRemoving] = useState<boolean>(false)
  const summaryText = subtitle || description

  const finalImageUrl = imageUrl ? imageUrl : podcast ? getPodcastShrunkImageUrl(podcast) : ''

  const _handleRemove = async () => {
    setIsRemoving(true)
    await handleRemove()
    setIsRemoving(false)
  }

  return (
    <>
      <li className='episode-list-item'>
        <div className='main-wrapper'>
          <PVLink className='content-wrapper' href={episodePageUrl}>
            {showPodcastInfo && (
              <PVImage
                alt={t('Podcast artwork')}
                height={PV.Images.sizes.medium}
                src={finalImageUrl}
                width={PV.Images.sizes.medium}
              />
            )}
            <div className='text-wrapper'>
              {showPodcastInfo && <div className='podcast-title'>{podcast.title}</div>}
              <h3>{title}</h3>
              <div
                className='description'
                dangerouslySetInnerHTML={{
                  __html: striptags(summaryText)
                }}
              />
            </div>
          </PVLink>
          <MediaItemControls buttonSize='medium' episode={episode} podcast={podcast} stretchMiddleContent />
        </div>
        {showRemoveButton && (
          <div className='side-wrapper'>
            <ButtonCircle
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
      <hr className='episode-list-item-hr' />
    </>
  )
}
