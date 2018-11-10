import { actionTypes } from '~/redux/constants'

export default (state =  {}, action) => {

  switch (action.type) {
    case actionTypes.CURRENT_PAGE_LOAD_EPISODE:
      return {
        episode: action.payload,
        mediaRef: null,
        nowPlayingItem: null,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_MEDIA_REF:
      return {
        episode: null,
        mediaRef: action.payload,
        nowPlayingItem: null,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_NOW_PLAYING_ITEM:
      return {
        episode: null,
        mediaRef: null,
        nowPlayingItem: action.payload,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_PODCAST:
      return {
        episode: null,
        mediaRef: null,
        nowPlayingItem: null,
        podcast: action.payload
      }
    default:
      return state
  }

}
