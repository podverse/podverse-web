import { actionTypes } from '~/redux/constants'

const defaultState = {
  addTo: '',
  forgotPassword: '',
  makeClip: '',
  login: '',
  queue: '',
  share: '',
  signUp: ''
}

export default (state = defaultState, action) => {

  switch (action.type) {
    case actionTypes.MODALS_ADD_TO_SHOW:
      return {
        addTo: {
          // @ts-ignore
          ...state.addTo,
          isOpen: action.payload.isOpen,
          nowPlayingItem: action.payload.nowPlayingItem,
          showQueue: action.payload.showQueue
        },
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_ADD_TO_IS_LOADING:
      return {
        addTo: {
          // @ts-ignore
          ...state.addTo,
          isLoading: action.payload
        },
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_ADD_TO_SET_ERROR_RESPONSE:
      return {
        addTo: {
          // @ts-ignore
          ...state.addTo,
          errorResponse: action.payload
        },
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SHOW:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          isOpen: action.payload
        },
        addTo: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          isLoading: action.payload
        },
        addTo: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SET_ERROR_RESPONSE:
      return {
        forgotPassword: {
          // @ts-ignore
          ...state.forgotPassword,
          errorResponse: action.payload
        },
        addTo: '',
        makeClip: '',
        login: '',
        queue: '',
        share: '',
        signUp: ''
      }
      case actionTypes.MODALS_LOGIN_SHOW:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isOpen: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        queue: '',
        share: '',
        signUp: ''
      }
      case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          isLoading: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        queue: '',
        share: '',
        signUp: ''
      }
      case actionTypes.MODALS_LOGIN_SET_ERROR_RESPONSE:
      return {
        login: {
          // @ts-ignore
          ...state.login,
          errorResponse: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        queue: '',
        share: '',
        signUp: ''
      }
      case actionTypes.MODALS_MAKE_CLIP_SHOW:
        return {
          makeClip: {
            // @ts-ignore
            ...state.makeClip,
            isEditing: action.payload.isEditing,
            isOpen: action.payload.isOpen,
            nowPlayingItem: action.payload.nowPlayingItem
          },
          addTo: '',
          forgotPassword: '',
          login: '',
          queue: '',
          share: '',
          signUp: ''
        }
      case actionTypes.MODALS_MAKE_CLIP_IS_LOADING:
        return {
          makeClip: {
            // @ts-ignore
            ...state.makeClip,
            isLoading: action.payload
          },
          addTo: '',
          forgotPassword: '',
          login: '',
          queue: '',
          share: '',
          signUp: ''
        }
      case actionTypes.MODALS_MAKE_CLIP_SET_ERROR_RESPONSE:
        return {
          makeClip: {
            // @ts-ignore
            ...state.makeClip,
            errorResponse: action.payload
          },
          addTo: '',
          forgotPassword: '',
          login: '',
          queue: '',
          share: '',
          signUp: ''
        }
    case actionTypes.MODALS_QUEUE_SHOW:
      return {
        queue: {
          // @ts-ignore
          ...state.queue,
          isOpen: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_QUEUE_IS_LOADING:
      return {
        queue: {
          // @ts-ignore
          ...state.queue,
          isLoading: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_QUEUE_SET_ERROR_RESPONSE:
      return {
        queue: {
          // @ts-ignore
          ...state.queue,
          errorResponse: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        share: '',
        signUp: ''
      }
    case actionTypes.MODALS_SHARE_SHOW:
      return {
        share: {
          // @ts-ignore
          ...state.share,
          clipLinkAs: action.payload.clipLinkAs,
          episodeLinkAs: action.payload.episodeLinkAs,
          isOpen: action.payload.isOpen,
          podcastLinkAs: action.payload.podcastLinkAs
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        signUp: ''
      }
    case actionTypes.MODALS_SHARE_IS_LOADING:
      return {
        share: {
          // @ts-ignore
          ...state.share,
          isLoading: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        signUp: ''
      }
    case actionTypes.MODALS_SHARE_SET_ERROR_RESPONSE:
      return {
        share: {
          // @ts-ignore
          ...state.share,
          errorResponse: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        signUp: ''
      }
    case actionTypes.MODALS_SIGN_UP_SHOW:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isOpen: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: ''
      }
    case actionTypes.MODALS_SIGN_UP_IS_LOADING:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          isLoading: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: ''
      }
    case actionTypes.MODALS_SIGN_UP_SET_ERROR_RESPONSE:
      return {
        signUp: {
          // @ts-ignore
          ...state.signUp,
          errorResponse: action.payload
        },
        addTo: '',
        forgotPassword: '',
        makeClip: '',
        login: '',
        queue: '',
        share: ''
      }
    default:
      return state
  }
  
}
