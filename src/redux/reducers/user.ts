import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.USER_SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload
      }
    default:
      return state
  }

}
