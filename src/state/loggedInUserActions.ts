import OmniAural from 'omniaural'
import { toggleSubscribeToPodcast as toggleSubscribeToPodcastService }
  from '~/services/loggedInUserServices'

/* Podcasts */

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  const userInfo = OmniAural.state.session.userInfo.value()

  if (!userInfo) {
    OmniAural.modalsLoginToAlertShow('subscribe to podcast')
  } else {
    try {
      const response = await toggleSubscribeToPodcastService(podcastId)
      const subscribedPodcastIds = response.data
      OmniAural.state.session?.userInfo?.subscribedPodcastIds?.set(subscribedPodcastIds)
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
