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
  podcast: Podcast
}

export const PodcastPageHeader = ({ podcast }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const { authors, categories, id } = podcast
  const authorEls = generateAuthorText(authors)
  const categoryEls = generateCategoryNodes(categories)
  const isSubscribed = userInfo?.subscribedPodcastIds?.includes(id)
  const subscribedText = isSubscribed ? t('Unsubscribe') : t('Subscribe')
  const podcastTitle = podcast.title ? podcast.title : t('untitledPodcast')
  const podcastTitleLinkUrl = `${PV.RoutePaths.web.podcast}/${podcast.id}`
  const hasBelowText = authorEls.length || categoryEls.length
  const imageUrl = getPodcastShrunkImageUrl(podcast)

  return (
    <>
      <div className='podcast-page-header'>
        <div className='main-max-width'>
          <div className='top-wrapper'>
            <PVImage
              alt={t('Podcast artwork')}
              height={PV.Images.sizes.xtraLarge}
              src={imageUrl}
              width={PV.Images.sizes.xtraLarge}
            />
            <div className='text-wrapper'>
              <div className='podcast-title'>
                <PVLink href={podcastTitleLinkUrl}>{podcastTitle}</PVLink>
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
              className='hide-below-tablet-xl-max-width'
              label={subscribedText}
              onClick={() => toggleSubscribeToPodcast(id)}
              type='tertiary'
            />
          </div>
          <div className='bottom-wrapper hide-above-laptop-min-width'>
            {hasBelowText && (
              <div className='sub-labels'>
                {authorEls.length > 0 && authorEls}
                {authorEls.length > 0 && categoryEls.length > 0 && ' • '}
                {categoryEls.length > 0 && categoryEls}
              </div>
            )}
            <ButtonRectangle
              className='hide-above-tablet-xl-min-width'
              label={subscribedText}
              onClick={() => toggleSubscribeToPodcast(id)}
              type='tertiary'
            />
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </>
  )
}
