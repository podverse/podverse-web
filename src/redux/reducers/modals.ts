import { actionTypes } from '~/redux/constants'

const defaultState = {
  forgotPassword: '',
  login: '',
  signUp: ''
}

export default (state = defaultState, action) => {

  switch (action.type) {
    case actionTypes.MODALS_FORGOT_PASSWORD_SHOW:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          isOpen: action.payload
        },
        login: '',
        signUp: ''
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          isLoading: action.payload
        },
        login: '',
        signUp: ''
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SET_ERROR_RESPONSE:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          errorResponse: action.payload
        },
        login: '',
        signUp: ''
      }
    case actionTypes.MODALS_LOGIN_SHOW:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isOpen: action.payload
        },
        forgotPassword: '',
        signUp: ''
      }
    case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isLoading: action.payload
        },
        forgotPassword: '',
        signUp: ''
      }
    case actionTypes.MODALS_LOGIN_SET_ERROR_RESPONSE:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          errorResponse: action.payload
        },
        forgotPassword: '',
        signUp: ''
      }
    case actionTypes.MODALS_SIGN_UP_SHOW:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isOpen: action.payload
        },
        forgotPassword: '',
        login: ''
      }
    case actionTypes.MODALS_SIGN_UP_IS_LOADING:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isLoading: action.payload
        },
        forgotPassword: '',
        login: ''
      }
    case actionTypes.MODALS_SIGN_UP_SET_ERROR_RESPONSE:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          errorResponse: action.payload
        },
        forgotPassword: '',
        login: ''
      }
    default:
      return state
  }

}
