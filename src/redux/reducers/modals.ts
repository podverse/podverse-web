import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.MODALS_FORGOT_PASSWORD_SHOW:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.login,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.login,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_SHOW:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_SIGN_UP_SHOW:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_SIGN_UP_IS_LOADING:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isLoading: action.payload
        }
      }
    default:
      return state
  }

}
