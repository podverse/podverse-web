
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaHeader } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import { alertPremiumRequired, alertSomethingWentWrong, alertRateLimitError, getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, userSetInfo } from '~/redux/actions'
import { toggleSubscribeToPodcast } from '~/services'

type Props = {
  episode?: any
  mediaRef?: any
  nowPlayingItem?: any
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  podcast?: any
  settings?: any
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
    const { episode, mediaRef, nowPlayingItem, podcast, user, userSetInfo
      } = this.props
    
    if (!user || !user.id) {
      alert('Login to subscribe to this podcast.')
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
      if (error && error.response && error.response.data && error.response.data.message === 'Premium Membership Required') {
        alertPremiumRequired()
      } else if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
      } else {
        alertSomethingWentWrong()
      }
    }

    this.setState({ isSubscribing: false })
  }

  getPodcastId(episode, mediaRef, nowPlayingItem, podcast) {
    let podcastId = ''
    if (episode) {
      podcastId = episode.podcast.id
    } else if (mediaRef) {
      podcastId = mediaRef.episode.podcast.id
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
    const { episode, mediaRef, nowPlayingItem, podcast, settings, user } = this.props
    const { nsfwLabelsHide } = settings
    const { subscribedPodcastIds } = user
    const { isSubscribing } = this.state
    
    let podcastId = this.getPodcastId(episode, mediaRef, nowPlayingItem, podcast)

    return (
      <MediaHeader
        episode={episode}
        handleLinkClick={this.linkClick}
        handleToggleSubscribe={this.toggleSubscribe}
        hideNSFWLabels={nsfwLabelsHide === 'true'}
        isSubscribed={subscribedPodcastIds && subscribedPodcastIds.includes(podcastId)}
        isSubscribing={isSubscribing}
        mediaRef={mediaRef}
        nowPlayingItem={nowPlayingItem}
        podcast={podcast} />
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaHeaderCtrl)
