import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { email, emailVerified, freeTrialExpiration, historyItems, id, isPublic, mediaRefs,
        membershipExpiration, name, playlists, queueItems, subscribedPlaylistIds,
        subscribedPodcastIds, subscribedUserIds } = action.payload

      return {
        ...state,
        ...(email || email === '' ? { email } : {}),
        ...(emailVerified ? { emailVerified } : {}),
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

    case actionTypes.USER_UPDATE_HISTORY_ITEM:
      const nowPlayingItem = action.payload
      const oldHistoryItems = state.historyItems
      const newHistoryItems = oldHistoryItems.map(x => x.episodeId === nowPlayingItem.episodeId ? nowPlayingItem : x)

      return {
        ...state,
        historyItems: newHistoryItems
      }
    default:
      return state
  }

}
