import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { historyItems, id, name, playlists, queueItems, subscribedPlaylistIds,
        subscribedPodcastIds } = action.payload

      return {
        ...state,
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === null ? { id } : {}),
        ...(name || name === null ? { name } : {}),
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPlaylistIds ? { subscribedPlaylistIds } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {})
      }
    default:
      return state
  }

}
