import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { email, freeTrialExpiration, historyItems, id, mediaRefs, membershipExpiration,
        name, playlists, queueItems, subscribedPlaylistIds, subscribedPodcastIds
        } = action.payload

      return {
        ...state,
        ...(email || email === '' ? { email } : {}),
        ...(freeTrialExpiration || freeTrialExpiration === '' ? { freeTrialExpiration } : {}),
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === '' ? { id } : {}),
        ...(mediaRefs ? { mediaRefs } : {}),
        ...(membershipExpiration || freeTrialExpiration === '' ? { membershipExpiration } : {}),
        ...(name || name === '' ? { name } : {}),
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPlaylistIds ? { subscribedPlaylistIds } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {})
      }
    default:
      return state
  }

}
