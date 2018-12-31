
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MediaHeader } from 'podverse-ui'
import { bindActionCreators } from 'redux'
import { alertPremiumRequired, alertSomethingWentWrong } from '~/lib/utility'
import { userSetInfo } from '~/redux/actions'
import { toggleSubscribeToPodcast } from '~/services'

type Props = {
  episode?: any
  mediaRef?: any
  nowPlayingItem?: any
  podcast?: any
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

    this.toggleSubscribe = this.toggleSubscribe.bind(this)
  }

  async toggleSubscribe() {
    const { episode, mediaRef, nowPlayingItem, podcast, user, userSetInfo } = this.props
    
    if (!user || !user.id) {
      alert('Login to subscribe to podcasts.')
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
      if (error.response.data === 'Premium Membership Required') {
        alertPremiumRequired()
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
      podcastId = mediaRef.podcastId
    } else if (nowPlayingItem) {
      podcastId = nowPlayingItem.podcastId
    } else if (podcast) {
      podcastId = podcast.id
    }

    return podcastId
  }

  render() {
    const { episode, mediaRef, nowPlayingItem, podcast, user } = this.props
    const { subscribedPodcastIds } = user
    const { isSubscribing } = this.state
    
    let podcastId = this.getPodcastId(episode, mediaRef, nowPlayingItem, podcast)

    return (
      <MediaHeader
        episode={episode}
        handleToggleSubscribe={this.toggleSubscribe}
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
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaHeaderCtrl)