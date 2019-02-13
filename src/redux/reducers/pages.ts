import { actionTypes } from '~/redux/constants'

const generateDataObj = payload => {
  if (payload) {
    const { categoryId, endReached, filterIsShowing, filterText, isLoadingInitial,
      isLoadingMore, isSearching, listItems, publicUser, queryFrom, queryPage, querySort,
      queryType, searchBy, searchText, selected } = payload

    return {
      ...(categoryId ? { categoryId } : {}),
      ...(endReached || endReached === false ? { endReached } : {}),
      ...(filterIsShowing || filterIsShowing === false ? { filterIsShowing } : {}),
      ...(filterText || filterText === '' ? { filterText } : {}),
      ...(isLoadingInitial || isLoadingInitial === false ? { isLoadingInitial } : {}),
      ...(isLoadingMore || isLoadingMore === false ? { isLoadingMore } : {}),
      ...(isSearching || isSearching === false ? { isSearching } : {}),
      ...(listItems ? { listItems } : {}),
      ...(publicUser ? { publicUser } : {}),
      ...(queryFrom ? { queryFrom } : {}),
      ...(queryPage ? { queryPage } : {}),
      ...(querySort ? { querySort } : {}),
      ...(queryType ? { queryType } : {}),
      ...(searchBy ? { searchBy } : {}),
      ...(searchText || searchText === '' ? { searchText } : {}),
      ...(selected ? { selected } : {})
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
