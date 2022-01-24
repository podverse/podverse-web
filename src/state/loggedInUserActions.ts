import OmniAural from 'omniaural'
import { toggleSubscribeToPodcast as toggleSubscribeToPodcastService } from '~/services/loggedInUserServices'
import { toggleSubscribeToPlaylistOnServer } from '~/services/playlist'
import { premiumFeatureRequestErrorHandler } from '~/services/request'
import { toggleSubscribeToUserOnServer } from '~/services/user'

export const toggleSubscribeToPodcast = async (podcastId: string, t: any) => {
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
      premiumFeatureRequestErrorHandler(t, error)
    }
  }
}

export const toggleSubscribeToPlaylist = async (playlistId: string, t: any) => {
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
      premiumFeatureRequestErrorHandler(t, error)
    }
  }
}

export const toggleSubscribeToUser = async (userId: string, t: any) => {
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
      premiumFeatureRequestErrorHandler(t, error)
    }
  }
}
