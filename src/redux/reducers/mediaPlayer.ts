import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MEDIA_PLAYER_LOAD_EPISODE:
      return Object.assign({}, state, {
        episode: action.episode,
        mediaRef: null
      })
    case actionTypes.MEDIA_PLAYER_LOAD_MEDIA_REF:
      return Object.assign({}, state, {
        episode: null,
        mediaRef: action.mediaRef
      })
    default:
      return state
  }
  
}
