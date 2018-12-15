import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { email, freeTrialExpiration, historyItems, id, membershipExpiration, name,
        playlists, queueItems, subscribedPlaylistIds, subscribedPodcastIds
        } = action.payload

      return {
        ...state,
        ...(email ? { email } : {}),
        ...(freeTrialExpiration ? { freeTrialExpiration } : {}),
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === null ? { id } : {}),
        ...(membershipExpiration ? { membershipExpiration } : {}),
        name,
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPlaylistIds ? { subscribedPlaylistIds } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {})
      }
    default:
      return state
  }

}
