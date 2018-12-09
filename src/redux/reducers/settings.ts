import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.SETTINGS_SET_NSFW_MODE:
      return {
        ...state,
        nsfwMode: action.payload
      }
    case actionTypes.SETTINGS_SET_UI_THEME:
      return {
        ...state,
        uiTheme: action.payload
      } 
    default:
      return state
  }
}
