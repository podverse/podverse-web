import { faDonate, faRss, faShare } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateAuthorText } from '~/lib/utility/author'
import { generateCategoryNodes } from '~/lib/utility/category'
import { getAuthorityFeedUrlFromArray } from '~/lib/utility/feedUrls'
import { getPodcastShrunkImageUrl } from '~/lib/utility/image'
import { PV } from '~/resources'
import { toggleSubscribeToPodcast } from '~/state/loggedInUserActions'
import { ButtonIcon, ButtonRectangle, PVImage, PVLink } from '..'

type Props = {
  episode?: Episode
  hideAboveMobileWidth?: boolean
  hideBelowMobileWidth?: boolean
  mediaRef?: MediaRef
  podcast: Podcast
}

export const PodcastPageHeader = ({
  episode,
  hideAboveMobileWidth,
  hideBelowMobileWidth,
  mediaRef,
  podcast
}: Props) => {
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
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)

  const _toggleSubscribeToPodcast = async () => {
    setIsSubscribing(true)
    await toggleSubscribeToPodcast(id, t)
    setIsSubscribing(false)
  }

  const _handleShowShareModal = () => {
    if (mediaRef) {
      OmniAural.modalsShareShowClip(mediaRef.id, episode.id, podcast.id)
    } else {
      OmniAural.modalsShareShowPodcast(podcast.id)
    }
  }

  const _handleShowFundingModal = () => {
    OmniAural.modalsFundingShow(podcast.funding)
  }

  const authorityFeedUrl = getAuthorityFeedUrlFromArray(podcast.feedUrls)

  const headerClass = classNames(
    'podcast-page-header',
    hideAboveMobileWidth ? 'hide-above-tablet-min-width' : '',
    hideBelowMobileWidth ? 'hide-below-mobile-max-width' : ''
  )

  let fundingLinks = []
  if (podcast.funding?.length) {
    fundingLinks = fundingLinks.concat(podcast.funding)
  }
  if (episode?.funding?.length) {
    fundingLinks = fundingLinks.concat(episode.funding)
  }

  return (
    <>
      <div className={headerClass}>
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
              isLoading={isSubscribing}
              onClick={() => _toggleSubscribeToPodcast()}
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
              className='hide-above-tablet-xl-min-width header-subscribe-button-mobile'
              label={subscribedText}
              isLoading={isSubscribing}
              onClick={() => _toggleSubscribeToPodcast()}
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
