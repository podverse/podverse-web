
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaHeader } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import PV from '~/lib/constants'
import { alertPremiumRequired, alertSomethingWentWrong, alertRateLimitError, getViewContentsElementScrollTop,
  safeAlert } from '~/lib/utility'
import { modalsSupportShow, pageIsLoading, pagesSetQueryState, userSetInfo } from '~/redux/actions'
import { toggleSubscribeToPodcast } from '~/services'
import { withTranslation } from 'i18n'

type Props = {
  episode?: any
  mediaRef?: any
  modals?: any
  modalsSupportShow?: any
  nowPlayingItem?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  podcast?: any
  settings?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {
  isSubscribing?: boolean
}

class MediaHeaderCtrl extends Component<Props, State> {

  static defaultProps: Props = {}

  constructor(props) {
    super(props)

    this.state = {}
  }

  toggleSubscribe = async () => {
    const { episode, mediaRef, nowPlayingItem, podcast, t, user, userSetInfo
      } = this.props
    
    if (!user || !user.id) {
      safeAlert(t('LoginToSubscribeToThisPodcast'))
      return
    }

    const podcastId = this.getPodcastId(episode, mediaRef, nowPlayingItem, podcast)

    this.setState({ isSubscribing: true })

    try {
      const response = await toggleSubscribeToPodcast(podcastId)

      if (response) {
        userSetInfo({ subscribedPodcastIds: response.data })
      }
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message === t('PremiumMembershipRequired')) {
        alertPremiumRequired(t)
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong(t)
      }
    }

    this.setState({ isSubscribing: false })
  }

  toggleSupportModal = () => {
    const { episode, modals, modalsSupportShow, podcast } = this.props
    const { support } = modals
    const { isOpen } = support
    const p = podcast || (episode && episode.podcast) || {}

    modalsSupportShow({
      episodeFunding: (episode && episode.funding) || [],
      isOpen: !isOpen,
      podcastFunding: p.funding || [],
      podcastShrunkImageUrl: p.shrunkImageUrl,
      podcastTitle: p.title,
      podcastValue: p.value || [],
    })
  }

  getPodcastId(episode, mediaRef, nowPlayingItem, podcast) {
    let podcastId = ''
    if (mediaRef) {
      podcastId = mediaRef.episode.podcast.id
    } else if (episode) {
      podcastId = episode.podcast.id
    } else if (nowPlayingItem) {
      podcastId = nowPlayingItem.podcastId
    } else if (podcast) {
      podcastId = podcast.id
    }

    return podcastId
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { episode, mediaRef, nowPlayingItem, podcast, settings, t, user } = this.props
    const { censorNSFWText } = settings
    const { subscribedPodcastIds } = user
    const { isSubscribing } = this.state
    const podcastId = this.getPodcastId(episode, mediaRef, nowPlayingItem, podcast)

    return (
      <MediaHeader
        censorNSFWText={censorNSFWText === 'true' || !censorNSFWText}
        episode={episode}
        handleLinkClick={this.linkClick}
        handleToggleSupport={this.toggleSupportModal}
        handleToggleSubscribe={this.toggleSubscribe}
        isSubscribed={subscribedPodcastIds && subscribedPodcastIds.includes(podcastId)}
        isSubscribing={isSubscribing}
        mediaRef={mediaRef}
        nowPlayingItem={nowPlayingItem}
        podcast={podcast}
        t={t} />
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsSupportShow: bindActionCreators(modalsSupportShow, dispatch),
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(MediaHeaderCtrl))
