import { useOmniAural } from 'omniaural'
import type { Episode, Podcast } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { generateAuthorText } from '~/lib/utility/author'
import { generateCategoryNodes } from '~/lib/utility/category'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { toggleSubscribeToPodcast } from '~/state/loggedInUserActions'
import { ButtonRectangle, PVImage, PVLink } from '..'

type Props = {
  episode: Episode
}

export const EpisodePageHeader = ({ episode }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const { podcast } = episode
  const { authors, categories, id } = podcast
  const authorEls = generateAuthorText(authors)
  const categoryEls = generateCategoryNodes(categories)
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')

  const episodeTitle = episode.title ? episode.title : t('untitledEpisode')

  const podcastTitle = podcast.title ? podcast.title : t('untitledPodcast')
  const podcastTitleLinkUrl = `${PV.RoutePaths.web.podcast}/${podcast.id}`
  const episodeTitleLinkUrl = `${PV.RoutePaths.web.episode}/${episode.id}`

  const hasBelowText = authorEls.length || categoryEls.length

  const imageUrl = episode?.imageUrl || getPodcastShrunkImageUrl(podcast)

  return (
    <div className='episode-page-header'>
      <div className='main-max-width'>
        <div className='top-wrapper'>
          <PVImage
            alt={t('Podcast artwork')}
            height={PV.Images.sizes.xtraLarge}
            src={imageUrl}
            width={PV.Images.sizes.xtraLarge}
          />
          <div className='text-wrapper'>
            <PVLink className='podcast-title' href={podcastTitleLinkUrl}>
              {podcastTitle}
            </PVLink>
            <div className='episode-title'>
              <PVLink href={episodeTitleLinkUrl}>{episodeTitle}</PVLink>
            </div>
            {hasBelowText && (
              <div className='sub-labels hide-below-tablet-xl-max-width'>
                {authorEls.length > 0 && authorEls}
                {authorEls.length > 0 && categoryEls.length > 0 && ' • '}
                {categoryEls.length > 0 && categoryEls}
              </div>
            )}
          </div>
          <ButtonRectangle
            className='hide-below-tablet'
            label={subscribedText}
            onClick={() => toggleSubscribeToPodcast(id)}
            type='tertiary'
          />
        </div>
        {hasBelowText && (
          <div className='bottom-wrapper hide-above-laptop-min-width'>
            <div className='sub-labels'>
              {authorEls.length > 0 && authorEls}
              {authorEls.length > 0 && categoryEls.length > 0 && ' • '}
              {categoryEls.length > 0 && categoryEls}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
