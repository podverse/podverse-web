import Link from 'next/link'
import { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import striptags from 'striptags'
import { MediaItemControls, PVImage, PVLink } from '~/components'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'

type Props = {
  episode: Episode
  imageUrl?: string
  showImage?: boolean
}

export const EpisodeListItem = ({ episode, showImage }: Props) => {
  const { t } = useTranslation()
  const { description, id, imageUrl } = episode
  const title = episode.title || t('untitledEpisode')
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${id}`

  return (
    <>
      <li className='episode-list-item'>
        <PVLink href={episodePageUrl}>
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
              <div className='description'
                dangerouslySetInnerHTML={
                {
                  __html: striptags(description)
                }
              } />
            </div>
          </div>
        </PVLink>
        <MediaItemControls
          buttonSize='medium'
          episode={episode}
          stretchMiddleContent />
      </li>
      <hr />
    </>
  )
}
