import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MEDIA_PLAYER_SET_CLIP_FINISHED:
      return {
        ...state,
        clipFinished: true
      }
    case actionTypes.MEDIA_PLAYER_SET_PLAYED_AFTER_CLIP_FINISHED:
      return {
        ...state,
        playedAfterClipFinished: action.payload
      }
    case actionTypes.MEDIA_PLAYER_LOAD_NOW_PLAYING_ITEM:
      return {
        ...state,
        clipFinished: false,
        nowPlayingItem: action.payload,
        playedAfterClipFinished: false
      }
    case actionTypes.MEDIA_PLAYER_UPDATE_PLAYING:
      return {
        ...state,
        playing: action.payload,
        didWaitToLoad: true
      }
    default:
      return state
  }
}
