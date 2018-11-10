import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.PLAYER_QUEUE_LOAD_PRIMARY_ITEMS:
      return {
        ...state,
        primaryItems: action.payload
      }
    case actionTypes.PLAYER_QUEUE_LOAD_SECONDARY_ITEMS:
      return {
        ...state,
        secondaryItems: action.payload
      }
    default:
      return state
  }
  
}
