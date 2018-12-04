import { actionTypes } from '~/redux/constants'

export default (state = {}, action) => {

  switch (action.type) {
    case actionTypes.IS_PAGE_LOADING:
      return {
        ...state,
        isPageLoading: action.payload
      }
    default:
      return state
  }

}
