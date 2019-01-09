import { actionTypes } from '~/redux/constants'

const generateDataObj = payload => {
  if (payload) {
    const { endReached, isLoadingInitial, isLoadingMore, listItems, queryFrom,
      queryPage, querySort, queryType } = payload
  
    return {
      ...(endReached || endReached === false ? { endReached } : {}),
      ...(isLoadingInitial || isLoadingInitial === false ? { isLoadingInitial } : {}),
      ...(isLoadingMore || isLoadingMore === false ? { isLoadingMore } : {}),
      ...(listItems ? { listItems } : {}),
      ...(queryFrom ? { queryFrom } : {}),
      ...(queryPage ? { queryPage } : {}),
      ...(querySort ? { querySort } : {}),
      ...(queryType ? { queryType } : {})
    }
  }

  return {}
}

export default (state = {}, action) => {
  const dataObj = generateDataObj(action.payload)
  
  switch (action.type) {
    case actionTypes.PAGES_SET_QUERY_STATE:
      const pageKey = action.payload.pageKey
      if (!pageKey) {
        return state
      }

      return {
        ...state,
        [pageKey]: {
          ...state[pageKey],
          ...dataObj
        }
      }
    default:
      return state
  }

}
