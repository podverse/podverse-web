import { actionTypes } from '~/redux/constants'

const defaultState = {
  addTo: {},
  clipCreated: {},
  forgotPassword: {},
  history: {},
  makeClip: {},
  login: {},
  queue: {},
  requestPodcast: {},
  share: {},
  signUp: {},
  support: {}
}

export default (state = defaultState, action) => {

  switch (action.type) {
    case actionTypes.MODALS_ADD_TO_SHOW:
      return {
        ...defaultState,
        addTo: {
          ...state.addTo,
          isOpen: action.payload.isOpen,
          nowPlayingItem: action.payload.nowPlayingItem,
          showQueue: action.payload.showQueue
        }
      }
    case actionTypes.MODALS_ADD_TO_IS_LOADING:
      return {
        ...defaultState,
        addTo: {
          ...state.addTo,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_ADD_TO_CREATE_PLAYLIST_IS_SAVING:
      return {
        ...defaultState,
        addTo: {
          ...state.addTo,
          createPlaylistIsSaving: action.payload
        }
      }
    case actionTypes.MODALS_ADD_TO_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        addTo: {
          ...state.addTo,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_ADD_TO_CREATE_PLAYLIST_SHOW:
      return {
        ...defaultState,
        addTo: {
          ...state.addTo,
          createPlaylistShow: action.payload
        }
      }
    case actionTypes.MODALS_CLIP_CREATED_SHOW:
      return {
        ...defaultState,
        clipCreated: {
          ...state.clipCreated,
          isOpen: action.payload.isOpen,
          mediaRef: action.payload.mediaRef
        }
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SHOW:
      return {
        ...defaultState,
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: false
        }
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_IS_LOADING:
      return {
        ...defaultState,
        forgotPassword: {
          ...state.forgotPassword,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_FORGOT_PASSWORD_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        forgotPassword: {
          ...state.forgotPassword,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_HISTORY_SHOW:
      return {
        ...defaultState,
        history: {
          ...state.history,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_SHOW:
      return {
        ...defaultState,
        login: {
          ...state.login,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_IS_LOADING:
      return {
        ...defaultState,
        login: {
          ...state.login,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_LOGIN_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        login: {
          ...state.login,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_MAKE_CLIP_SHOW:
        return {
          ...defaultState,
          makeClip: {
            ...state.makeClip,
            isEditing: action.payload.isEditing,
            isOpen: action.payload.isOpen,
            nowPlayingItem: action.payload.nowPlayingItem
          }
        }
    case actionTypes.MODALS_MAKE_CLIP_SET_ERROR_RESPONSE:
        return {
          ...defaultState,
          makeClip: {
            ...state.makeClip,
            errorResponse: action.payload
          }
        }
    case actionTypes.MODALS_QUEUE_SHOW:
      return {
        ...defaultState,
        queue: {
          ...state.queue,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_QUEUE_IS_LOADING:
      return {
        ...defaultState,
        queue: {
          ...state.queue,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_QUEUE_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        queue: {
          ...state.queue,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_REQUEST_PODCAST_SHOW:
      return {
        ...defaultState,
        requestPodcast: {
          isOpen: action.payload.isOpen
        }
      }
    case actionTypes.MODALS_RESET_PASSWORD_SHOW:
      return {
        ...defaultState,
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: true,
          isSendVerificationEmail: false
        }
      }
    case actionTypes.MODALS_SEND_VERIFICATION_EMAIL_SHOW:
      return {
        ...defaultState,
        forgotPassword: {
          ...state.forgotPassword,
          isOpen: action.payload,
          isResetPassword: false,
          isSendVerificationEmail: true
        }
      }
    case actionTypes.MODALS_SHARE_SHOW:
      return {
        ...defaultState,
        share: {
          ...state.share,
          clipLinkAs: action.payload.clipLinkAs,
          episodeLinkAs: action.payload.episodeLinkAs,
          isOpen: action.payload.isOpen,
          podcastLinkAs: action.payload.podcastLinkAs
        }
      }
    case actionTypes.MODALS_SHARE_IS_LOADING:
      return {
        ...defaultState,
        share: {
          ...state.share,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_SHARE_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        share: {
          ...state.share,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_SIGN_UP_SHOW:
      return {
        ...defaultState,
        signUp: {
          ...state.signUp,
          isOpen: action.payload
        }
      }
    case actionTypes.MODALS_SIGN_UP_IS_LOADING:
      return {
        ...defaultState,
        signUp: {
          ...state.signUp,
          isLoading: action.payload
        }
      }
    case actionTypes.MODALS_SIGN_UP_SET_ERROR_RESPONSE:
      return {
        ...defaultState,
        signUp: {
          ...state.signUp,
          errorResponse: action.payload
        }
      }
    case actionTypes.MODALS_SUPPORT_SHOW:
      return {
        ...defaultState,
        support: {
          ...state.support,
          episodeFunding: action.payload.episodeFunding,
          isOpen: action.payload.isOpen,
          podcastFunding: action.payload.podcastFunding,
          podcastShrunkImageUrl: action.payload.podcastShrunkImageUrl,
          podcastTitle: action.payload.podcastTitle,
          podcastValue: action.payload.podcastValue
        }
      }
    default:
      return state
  }
}
