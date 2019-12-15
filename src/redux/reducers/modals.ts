import { actionTypes } from '~/redux/constants'

const defaultState = {
  addTo: {},
  clipCreated: {},
  forgotPassword: {},
  makeClip: {},
  login: {},
  queue: {},
  share: {},
  signUp: {}
}

export default (state = defaultState, action) => {

  switch (action.type) {
    case actionTypes.MODALS_ADD_TO_SHOW:
      return {
        addTo: {
          ...state.addTo,
          isOpen: action.payload.isOpen,
          nowPlayingItem: action.payload.nowPlayingItem,
          showQueue: action.payload.showQueue
        },
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_ADD_TO_IS_LOADING:
      return {
        addTo: {
          ...state.addTo,
          isLoading: action.payload
        },
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_ADD_TO_CREATE_PLAYLIST_IS_SAVING:
      return {
        addTo: {
          ...state.addTo,
          createPlaylistIsSaving: action.payload
        },
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_ADD_TO_SET_ERROR_RESPONSE:
      return {
        addTo: {
          ...state.addTo,
          errorResponse: action.payload
        },
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_ADD_TO_CREATE_PLAYLIST_SHOW:
      return {
        addTo: {
          ...state.addTo,
          createPlaylistShow: action.payload
        },
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_CLIP_CREATED_SHOW:
      return {
        clipCreated: {
          ...state.clipCreated,
          isOpen: action.payload.isOpen,
          mediaRef: action.payload.mediaRef
        },
        addTo: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SHOW:
      return {
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: false
        },
        addTo: {},
        clipCreated: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING:
      return {
        forgotPassword: {
          ...state.forgotPassword,
          isLoading: action.payload
        },
        addTo: {},
        clipCreated: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SET_ERROR_RESPONSE:
      return {
        forgotPassword: {
          ...state.forgotPassword,
          errorResponse: action.payload
        },
        addTo: {},
        clipCreated: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
      case actionTypes.MODALS_LOGIN_SHOW:
      return {
        login: {
          ...state.login,
          isOpen: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        queue: {},
        share: {},
        signUp: {}
      }
      case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        login: {
          ...state.login,
          isLoading: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        queue: {},
        share: {},
        signUp: {}
      }
      case actionTypes.MODALS_LOGIN_SET_ERROR_RESPONSE:
      return {
        login: {
          ...state.login,
          errorResponse: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        queue: {},
        share: {},
        signUp: {}
      }
      case actionTypes.MODALS_MAKE_CLIP_SHOW:
        return {
          makeClip: {
            ...state.makeClip,
            isEditing: action.payload.isEditing,
            isOpen: action.payload.isOpen,
            nowPlayingItem: action.payload.nowPlayingItem
          },
          addTo: {},
          clipCreated: {},
          forgotPassword: {},
          login: {},
          queue: {},
          share: {},
          signUp: {}
        }
      case actionTypes.MODALS_MAKE_CLIP_SET_ERROR_RESPONSE:
        return {
          makeClip: {
            ...state.makeClip,
            errorResponse: action.payload
          },
          addTo: {},
          clipCreated: {},
          forgotPassword: {},
          login: {},
          queue: {},
          share: {},
          signUp: {}
        }
    case actionTypes.MODALS_QUEUE_SHOW:
      return {
        queue: {
          ...state.queue,
          isOpen: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_QUEUE_IS_LOADING:
      return {
        queue: {
          ...state.queue,
          isLoading: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_QUEUE_SET_ERROR_RESPONSE:
      return {
        queue: {
          ...state.queue,
          errorResponse: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_RESET_PASSWORD_SHOW:
      return {
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: true,
          isSendVerificationEmail: false
        },
        addTo: {},
        clipCreated: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_SEND_VERIFICATION_EMAIL_SHOW:
      return {
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: false,
          isSendVerificationEmail: true
        },
        addTo: {},
        clipCreated: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {},
        signUp: {}
      }
    case actionTypes.MODALS_SHARE_SHOW:
      return {
        share: {
          ...state.share,
          clipLinkAs: action.payload.clipLinkAs,
          episodeLinkAs: action.payload.episodeLinkAs,
          isOpen: action.payload.isOpen,
          podcastLinkAs: action.payload.podcastLinkAs
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        signUp: {}
      }
    case actionTypes.MODALS_SHARE_IS_LOADING:
      return {
        share: {
          ...state.share,
          isLoading: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        signUp: {}
      }
    case actionTypes.MODALS_SHARE_SET_ERROR_RESPONSE:
      return {
        share: {
          ...state.share,
          errorResponse: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        signUp: {}
      }
    case actionTypes.MODALS_SIGN_UP_SHOW:
      return {
        signUp: {
          ...state.signUp,
          isOpen: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {}
      }
    case actionTypes.MODALS_SIGN_UP_IS_LOADING:
      return {
        signUp: {
          ...state.signUp,
          isLoading: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {}
      }
    case actionTypes.MODALS_SIGN_UP_SET_ERROR_RESPONSE:
      return {
        signUp: {
          ...state.signUp,
          errorResponse: action.payload
        },
        addTo: {},
        clipCreated: {},
        forgotPassword: {},
        makeClip: {},
        login: {},
        queue: {},
        share: {}
      }
    default:
      return state
  }
}
