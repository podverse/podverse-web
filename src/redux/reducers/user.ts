import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_INFO:
      const { historyItems, id, playlists, queueItems, subscribedPodcastIds }
        = action.payload

      return {
        ...state,
        ...(historyItems ? { historyItems } : {}),
        ...(id || id === null ? { id } : {}),
        ...(playlists ? { playlists } : {}),
        ...(queueItems ? { queueItems } : {}),
        ...(subscribedPodcastIds ? { subscribedPodcastIds } : {})
      }
    default:
      return state
  }

}
