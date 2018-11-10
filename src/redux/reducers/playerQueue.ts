import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.PLAYER_QUEUE_LOAD_PRIMARY_ITEMS:
      return Object.assign({}, state, {
        playerQueue: {
          primaryItems: action.primaryItems
        }
      })
    case actionTypes.PLAYER_QUEUE_LOAD_SECONDARY_ITEMS:
      return Object.assign({}, state, {
        playerQueue: {
          secondaryItems: action.secondaryItems
        }
      })
    default:
      return state
  }
  
}