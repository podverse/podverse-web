import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.PAGE_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    default:
      return state
  }

}
