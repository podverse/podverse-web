import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MEDIA_PLAYER_LOAD_NOW_PLAYING_ITEM:
      return {
        ...state,
        nowPlayingItem: action.payload
      }
    case actionTypes.MEDIA_PLAYER_UPDATE_PLAYING:
      return {
        ...state,
        playing: action.payload
      }
    default:
      return state
  }
  
}
