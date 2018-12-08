import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { historyItems, id, playlists, queueItems, subscribedPlaylistIds,
        subscribedPodcastIds } = action.payload

      return {
        ...state,
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === null ? { id } : {}),
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPlaylistIds ? { subscribedPlaylistIds } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {})
      }
    default:
      return state
  }

}
