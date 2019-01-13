import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { email, freeTrialExpiration, historyItems, id, isPublic, mediaRefs,
        membershipExpiration, name, playlists, queueItems, subscribedPlaylistIds,
        subscribedPodcastIds, subscribedUserIds } = action.payload

      return {
        ...state,
        ...(email || email === '' ? { email } : {}),
        ...(freeTrialExpiration || freeTrialExpiration === '' || freeTrialExpiration === null ? { freeTrialExpiration } : {}),
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === '' ? { id } : {}),
        ...(isPublic || isPublic === false ? { isPublic } : {}),
        ...(mediaRefs ? { mediaRefs } : {}),
        ...(membershipExpiration || freeTrialExpiration === '' || membershipExpiration === null ? { membershipExpiration } : {}),
        ...(name || name === '' ? { name } : {}),
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPlaylistIds ? { subscribedPlaylistIds } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {}),
        ...(subscribedUserIds ? { subscribedUserIds } : {})
      }
    default:
      return state
  }

}
