import { faDonate, faRss, faShare } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { generateAuthorText } from '~/lib/utility/author'
import { generateCategoryNodes } from '~/lib/utility/category'
import { getAuthorityFeedUrlFromArray } from '~/lib/utility/feedUrls'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { toggleSubscribeToPodcast } from '~/state/loggedInUserActions'
import { OmniAuralState } from '~/state/omniauralState'
import { ButtonIcon, ButtonRectangle, PVImage, PVLink } from '..'

type Props = {
  episode: Episode
}

export const EpisodePageHeader = ({ episode }: Props) => {
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
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

  const _handleShowShareModal = () => {
    OmniAural.modalsShareShowEpisode(episode.id, podcast.id)
  }

  const _handleShowFundingModal = () => {
    OmniAural.modalsFundingShow(podcast.funding)
  }

  const authorityFeedUrl = getAuthorityFeedUrlFromArray(podcast.feedUrls)

  let fundingLinks = []
  if (episode?.funding?.length) {
    fundingLinks = fundingLinks.concat(episode.funding)
  }
  if (podcast?.funding?.length) {
    fundingLinks = fundingLinks.concat(podcast?.funding)
  }

  return (
    <>
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
              <div className='header-sub-buttons hide-below-tablet-xl-max-width'>
                {authorityFeedUrl?.url && (
                  <ButtonIcon
                    className='header-rss-button'
                    faIcon={faRss}
                    href={authorityFeedUrl.url}
                    isSecondary
                    rel='noreferrer'
                    target='_blank'
                  />
                )}
                <ButtonIcon
                  className='header-share-button'
                  faIcon={faShare}
                  isSecondary
                  onClick={_handleShowShareModal}
                />
                {!!fundingLinks.length && (
                  <ButtonIcon
                    className='header-funding-button'
                    faIcon={faDonate}
                    isSecondary
                    onClick={_handleShowFundingModal}
                  />
                )}
              </div>
            </div>
            <ButtonRectangle
              className='hide-below-tablet-max-width header-subscribe-button'
              label={subscribedText}
              onClick={() => toggleSubscribeToPodcast(id, t)}
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
              className='hide-below-tablet-max-width header-subscribe-button-mobile'
              label={subscribedText}
              onClick={() => toggleSubscribeToPodcast(id, t)}
              type='tertiary'
            />
          </div>
          <div className='mobile-header-sub-buttons hide-above-laptop-min-width'>
            {authorityFeedUrl?.url && (
              <ButtonIcon
                className='header-rss-button-mobile'
                faIcon={faRss}
                href={authorityFeedUrl.url}
                isSecondary
                rel='noreferrer'
                target='_blank'
              />
            )}
            <ButtonIcon
              className='header-share-button-mobile'
              faIcon={faShare}
              isSecondary
              onClick={_handleShowShareModal}
            />
            {!!fundingLinks.length && (
              <ButtonIcon
                className='header-funding-button-mobile'
                faIcon={faDonate}
                isSecondary
                onClick={_handleShowFundingModal}
              />
            )}
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </>
  )
}
