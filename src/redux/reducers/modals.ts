import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MODALS_LOGIN_SHOW:
      return {
        ...state,
        login: {
          // @ts-ignore
          ...state.login,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        ...state,
        login: {
          // @ts-ignore
          ...state.login,
          isLoading: action.payload
        }
      }
    default:
      return state
  }

}
