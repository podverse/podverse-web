import { actionTypes } from '~/redux/constants'

export default (state =  {}, action) => {

  switch (action.type) {
    case actionTypes.CURRENT_PAGE_LOAD_EPISODE:
      return {
        ...state,
        episode: action.payload,
        mediaRef: null,
        nowPlayingItem: null,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_LIST_ITEMS:
      return {
        ...state,
        listItems: action.payload,
      }
    case actionTypes.CURRENT_PAGE_LOAD_MEDIA_REF:
      return {
        ...state,
        episode: null,
        mediaRef: action.payload,
        nowPlayingItem: null,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_NOW_PLAYING_ITEM:
      return {
        ...state,
        episode: null,
        mediaRef: null,
        nowPlayingItem: action.payload,
        podcast: null
      }
    case actionTypes.CURRENT_PAGE_LOAD_PODCAST:
      return {
        ...state,
        episode: null,
        mediaRef: null,
        nowPlayingItem: null,
        podcast: action.payload
      }
    default:
      return state
  }

}
