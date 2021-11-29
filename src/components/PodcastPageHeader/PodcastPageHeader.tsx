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
  episode?: Episode
  podcast: Podcast
}

export const PodcastPageHeader = ({ episode, podcast }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const { authors, categories, id } = podcast
  const authorEls = generateAuthorText(authors)
  const categoryEls = generateCategoryNodes(categories)
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')

  const mainTitle = episode
    ? episode.title
      ? episode.title
      : t('untitledEpisode')
    : podcast.title
      ? podcast.title
      : t('untitledPodcast')

  const aboveTitle = episode
    ? podcast.title
      ? podcast.title 
      : t('untitledPodcast')
    : null

  const aboveTitleLinkUrl = episode
    ? `${PV.RoutePaths.web.podcast}/${podcast.id}`
    : ''

  const mainTitleLinkUrl = episode
    ? `${PV.RoutePaths.web.episode}/${episode.id}`
    : `${PV.RoutePaths.web.podcast}/${podcast.id}`

  const hasBelowText = authorEls.length || categoryEls.length

  const imageUrl = episode?.imageUrl || getPodcastShrunkImageUrl(podcast)

  return (
    <div
      className='podcast-page-header'>
      <div className='main-max-width'>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.large}
          src={imageUrl}
          width={PV.Images.sizes.large}
        />
        <div className='text-wrapper'>
          {
            aboveTitle && (
              <PVLink
                className='above-text'
                href={aboveTitleLinkUrl}>
                {aboveTitle}
              </PVLink>
            )
          }
          <h1>
            <PVLink href={mainTitleLinkUrl}>
              {mainTitle}
            </PVLink>
          </h1>
          {
            hasBelowText && (
              <div className='below-text'>
                {authorEls.length > 0 && authorEls}
                {authorEls.length > 0 && categoryEls.length > 0 && ' • '}
                {categoryEls.length > 0 && categoryEls}
              </div>
            ) 
          }
        </div>
        <ButtonRectangle
          label={subscribedText}
          onClick={() => toggleSubscribeToPodcast(id)}
          type='tertiary' />
      </div>
    </div>
  )
}
