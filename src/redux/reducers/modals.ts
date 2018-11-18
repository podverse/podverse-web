import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MODALS_HIDE_LOGIN:
      return {
        ...state,
        showLogin: false
      }
    case actionTypes.MODALS_SHOW_LOGIN:
      return {
        ...state,
        showLogin: true
      }
    default:
      return state
  }

}
