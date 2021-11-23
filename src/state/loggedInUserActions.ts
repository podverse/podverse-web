import OmniAural from 'omniaural'
import { toggleSubscribeToPodcast as toggleSubscribeToPodcastService }
  from '~/services/loggedInUserServices'
import { toggleSubscribeToPlaylistOnServer } from '~/services/playlist'
import { toggleSubscribeToUserOnServer } from '~/services/user'

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  const userInfo = OmniAural.state.session.userInfo.value()

  if (!userInfo) {
    OmniAural.modalsLoginToAlertShow('subscribe to podcast')
  } else {
    try {
      OmniAural.pageIsLoadingShow()
      const response = await toggleSubscribeToPodcastService(podcastId)
      const subscribedPodcastIds = response.data
      OmniAural.state.session?.userInfo?.subscribedPodcastIds?.set(subscribedPodcastIds)
      OmniAural.pageIsLoadingHide()
    } catch (error) {
      console.log('toggleSubscribeToPodcast', error)
      // if (error && error.response && error.response.data && error.response.data.message === t('PremiumMembershipRequired')) {
      //   alertPremiumRequired(t)
      // } else if (error && error.response && error.response.status === 429) {
      //   alertRateLimitError(error)
      // } else {
      //   alertSomethingWentWrong(t)
      // }
    }
  }
}

export const toggleSubscribeToPlaylist = async (playlistId: string) => {
  const userInfo = OmniAural.state.session.userInfo.value()

  if (!userInfo) {
    OmniAural.modalsLoginToAlertShow('subscribe to playlist')
  } else {
    try {
      OmniAural.pageIsLoadingShow()
      const response = await toggleSubscribeToPlaylistOnServer(playlistId)
      const subscribedPlaylistIds = response.data
      OmniAural.state.session?.userInfo?.subscribedPlaylistIds?.set(subscribedPlaylistIds)
      OmniAural.pageIsLoadingHide()
    } catch (error) {
      console.log('toggleSubscribeToPlaylist', error)
      // if (error && error.response && error.response.data && error.response.data.message === t('PremiumMembershipRequired')) {
      //   alertPremiumRequired(t)
      // } else if (error && error.response && error.response.status === 429) {
      //   alertRateLimitError(error)
      // } else {
      //   alertSomethingWentWrong(t)
      // }
    }
  }
}

export const toggleSubscribeToUser = async (userId: string) => {
  const userInfo = OmniAural.state.session.userInfo.value()

  if (!userInfo) {
    OmniAural.modalsLoginToAlertShow('subscribe to profile')
  } else {
    try {
      OmniAural.pageIsLoadingShow()
      const subscribedUserIds = await toggleSubscribeToUserOnServer(userId)
      OmniAural.state.session?.userInfo?.subscribedUserIds?.set(subscribedUserIds)
      OmniAural.pageIsLoadingHide()
    } catch (error) {
      console.log('toggleSubscribeToUser', error)
      // if (error && error.response && error.response.data && error.response.data.message === t('PremiumMembershipRequired')) {
      //   alertPremiumRequired(t)
      // } else if (error && error.response && error.response.status === 429) {
      //   alertRateLimitError(error)
      // } else {
      //   alertSomethingWentWrong(t)
      // }
    }
  }
}
