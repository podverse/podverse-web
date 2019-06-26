import { actionTypes } from '~/redux/constants'

export default (state: any = {}, action) => {

  switch (action.type) {
    case actionTypes.PLAYER_QUEUE_LOAD_ITEMS:
      return {
        ...state,
        priorityItems: action.payload.priorityItems,
        secondaryItems: action.payload.secondaryItems
      }
    case actionTypes.PLAYER_QUEUE_ADD_SECONDARY_ITEMS:
      let combinedItems = state.secondaryItems || []
      combinedItems = combinedItems.concat(action.payload)
      
      return {
        ...state,
        secondaryItems: combinedItems
      }
    case actionTypes.PLAYER_QUEUE_LOAD_PRIMARY_ITEMS:
      return {
        ...state,
        priorityItems: action.payload
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
